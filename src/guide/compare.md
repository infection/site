---
title: Compare with competitors
type: guide
order: 101
---

What is the difference between Infection and other PHP mutation testing frameworks?

Well, there is only one competitor at the moment - Humbug.

## Technical differences

### Mutations

The main and the best difference is that Infection uses AST (Abstract Syntax Tree) to mutate the code. It brings so much value to the framework:

* Much easier to support code
* Much easier to write new Mutators
* Much easier to handle false-positives and different edge cases, e.g. deciding when mutation should be done or should not in difficult situation

Let's look at the following examples to understand how AST helps here. This is an implementation of mutator in Infection:

``` php
// https://github.com/infection/infection/blob/master/src/Mutator/Arithmetic/Plus.php

class Plus implements Mutator
{
    /**
     * Replaces "+" with "-"
     *
     * @param Node $node
     * @return Node\Expr\BinaryOp\Minus
     */
    public function mutate(Node $node)
    {
        return new Node\Expr\BinaryOp\Minus($node->left, $node->right, $node->getAttributes());
    }

    public function shouldMutate(Node $node) : bool
    {
        if (!($node instanceof Node\Expr\BinaryOp\Plus)) {
            return false;
        }

        if ($node->left instanceof Array_ && $node->right instanceof Array_) {
            return false;
        }

        return true;
    }
}
```
The code is very clear. The class is small. Here we are working with objects that represent nodes of our code in an Object Oriented way.

Let's look at the Humbug's implementation of the same mutator that replaces `+` with `-`.

``` php
class Addition extends MutatorAbstract
{
    public static function getMutation(array &$tokens, $index)
    {
        $tokens[$index] = '-';
    }

    public static function mutates(array &$tokens, $index)
    {
        $t = $tokens[$index];
        if (!is_array($t) && $t == '+') {
            $tokenCount = count($tokens);
            for ($i = $index + 1; $i < $tokenCount; $i++) {
                // check for short array syntax
                if (!is_array($tokens[$i]) && $tokens[$i][0] == '[') {
                    return false;
                }
                // check for long array syntax
                if (is_array($tokens[$i]) && $tokens[$i][0] == T_ARRAY && $tokens[$i][1] == 'array') {
                    return false;
                }
                // if we're at the end of the array
                // and we didn't see any array, we
                // can probably mutate this addition
                if (!is_array($tokens[$i]) && $tokens[$i] == ';') {
                    return true;
                }
            }
            return true;
        }
        return false;
    }
}
```

Do you see the difference? Just imagine how difficult to understand and support such code. 

> I don't say that Humbug's code is bad, no. Here I just want to show you that using AST brings so much value and simplifies the code a lot.

If you still don't believe that AST is a thing, just compare these two mutators that replace `return functionCall();` with `functionCall(); return null;`:

* Humbug: https://github.com/humbug/humbug/blob/1.0.0-alpha2/src/Mutator/ReturnValue/FunctionCall.php
* Infection: https://github.com/infection/infection/blob/0.2.1/src/Mutator/ReturnValue/FunctionCall.php

Excited?

### Dependencies in `composer.json`

I spent much time understanding how we can get rid of PHPUnit and PhpSpec dependencies for production build of Infection.

In order to run particular (not all) tests from the suite for each Mutation, Humbug subscribes to the PHPUnit process with its own listener and filters out not needed tests. So it has a listener that extends PHPUnit's `\PHPUnit_Framework_BaseTestListener` class. This couples Humbug with PHPUnit, even with particular version(s).

Obviously, if the code you are mutating uses a different (incompatible) version of PHPUnit, you can not use Humbug in this case.

#### How did we solve this issue in Infection?

Ok, the answer is `XML` reports. PHPUnit generates the same (almost ;)) `XML` for running test suite where we can find information about executed lines of code, time of each test case, the original path to the tested file and so on. Moreover, PHPUnit allows adding a set of test files that need to be ran in its `phpunit.xml` file.

So, instead of filtering tests in runtime, Infection just adds correct files to custom `phpunit.xml` and runs the test suite with it. That's it.

### Developer experience (DX)

One of the best initiatives in the PHP community is a Developer Experience improvements.

Let's have an example of `configure` command of Infection. The typical mutation framework works like:

* you run mutation tool
* it does not find a config file and fails with an error message
* you run `configure` command (or something similar) and create this config
* you run mutation tool again

So many annoying steps.

Thanks to Symfony's Console component, it's possible to run commands from another command. And this is exactly what we need. Let's look how the process looks like in Infection:

* you run `infection` for the first time
* it does not find `infection.json.dist`
* it automatically runs `infection configure` command without interrupting the main process
* it asks you some questions and *tries to guess* all possible values for you
* after configuration is done, it just continues with the initial command

So you run `infection` only once.

#### Set of Guessers from `configure` command

##### PHPUnit Config Path Guesser

Do you remember old versions of Symfony where `phpunit.xml.dist` was located in `./app` folder?

Infection's `PhpUnitPathGuesser` parses your `composer.json` file and automatically suggests custom path where PHPUnit's config file is found.

##### Source dirs Guesser

Thanks to `PSR-0` and `PSR-4`, you can configure your source folders in `composer.json`:

``` json
{
    "autoload": {
        "psr-4": {
            "Infection\\": "src/"
        }
    }
}
```

`SourceDirGuesser` automatically parses your `composer.json` file and suggests all source folders for you (as a default value or by autocompletion feature of Symfony Console component).

There are several other guessers but I believe you see the point.

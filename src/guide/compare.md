---
title: Compare with competitors
type: guide
order: 6
---

The main question is what is the difference between Infection and other PHP mutation testing frameworks?

Well, there is only one competitor at the moment - Humbug.

## Technical differences

### Mutations

As it was said before, Infection uses AST (Abstract Syntax Tree) to mutate the code. It brings so much value to the framework:

* Much easier to support code
* Much easier to write new Mutators
* Much easier to handle false-positives and different edgecases, e.g. when mutation should be done or should not

Let's look at the following examples to understand how AST helps here:

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

The code is very clear. Class is small. Here we are working with objects that represents nodes of our code.

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

Do you see the difference? Just imaging how difficult to understand and support such code. 

> I don't say that Humbug's code is bad, no. Here I just want to show you that using AST brings so much values and simplifies code a lot.

If you still don't believe that AST is a thing, just compare these two mutators that replaces returned function call with null:

* Humbug: https://github.com/humbug/humbug/blob/1.0.0-alpha2/src/Mutator/ReturnValue/FunctionCall.php
* Infection: https://github.com/infection/infection/blob/0.2.1/src/Mutator/ReturnValue/FunctionCall.php

Excited? I'm too.

### Dependencies in `composer.json`

I spent much time understanding how we can get rid of PhpUnit and PhpSpec dependencies for production build of Infection.

In order to run particular (not all) tests from the suite for each Mutation, Humbug subscribes to the PhpUnit process with its own listener and filters out not needed tests. So it has listener that implements PHPUnit's interface. This couples Humbug with PHPUnit, even with particular verion(s).

Obviously, if the code you are mutating uses different (incompatible) version of PHPUnit, you can not use Humbug in this case.

How did we solve this issue in Infection? How do we filter out not needed tests for each mutation?

Ok, the answer is XML reports. PHPUnit generates the same (almost ;)) XML for runnable test suite where we can find information about executed lines of code, time of each test case, origin path to the tested file and so on. Moreover, PHPUnit allows to add a set of test files that need to be ran in its `phpunit.xml` file.

So, instead of filtering tests in runtime, Infection just adds correct files to custom `phpunit.xml` and runs the test suite with it. That's it.

### Developer expirience (DX)

One of the best initiative in the PHP community is a Developer Expirience. 

Automatically run `configure` command if `infection.json.dist` is not found.

### Set of Guessers

* phpunit config path guesser
* blblalb - check all providers
---
title: Custom Mutators
type: guide
order: 60
---

Starting from Infection 0.29.0, it's possible to create custom mutators that can be used by Infection.

> Before creating mutator, make sure it's not already supported by Infection itself by looking into our [built-in mutators](/guide/mutators.html).

Imaging we want to create a mutator that replaces any string with `Infected!`, like this:

```diff
- throw new RuntimeException('File not found');
+ throw new RuntimeException('Infected!');
```


# 1. Install `infection/mutator` and create a class that implements `Mutator` interface

Custom Mutator must implement `Mutator` interface which is located in `infection/mutator` package. Install it by:

```bash
composer require infection/mutator
```

Then, create a class that implements this interface:

```php

namesapce App\Mutator;

use PhpParser\Node;

class AnyStringToInfectedMutator implements Mutator
{
    public function canMutate(Node $node): bool
    {
        return $node instanceof Node\Scalar\String_;
    }
    
    /**
     * @psalm-mutation-free
     *
     * @return iterable<Node\Scalar\String_>
     */
    public function mutate(Node $node): iterable
    {
        yield new Node\Scalar\String_('Infected!', $node->getAttributes());
    }
        
    public static function getDefinition(): Definition
    {
        return new Definition(
            <<<'TXT'
                Replaces any string with "Infected!" string.
                TXT
            ,
            MutatorCategory::ORTHOGONAL_REPLACEMENT,
            null,
            <<<'DIFF'
                - throw new RuntimeException('File not found');
                + throw new RuntimeException('Infected!');
                DIFF,
        );
    }
}
```

- `canMutate()` method is used to determine if the current mutator can mutate the node during traversing AST. Wha we are interested in here is `Node\Scalar\String_` class that represents strings in `nikic/php-parser` lib.

> How to know which AST node you need? You can play wih AST in this awesome tool, by writing simple source code and clicking to AST nodes: https://getrector.com/ast

- `mutate()` method is the code where our mutation happens. This method is only executed if `canMutate()` returns `true` for a `Node`, so we always know that an instance of `Node\Scalar\String_` is passed to `mutate()`. What we do here is just creating a new `Node\Scalar\String_` instance passing `Infected!` string, and preserve original node attributes (internal things like position of the node and others). Make sure to always create new nodes with keeping original attributes.
- `getDefiniion()` is a method that returns information about new mutator: it's description, category and diff between original and mutated code. Make sure to always add details here. This will be used for docuemntation and `bin/infection describe` command.

<br/>

# 2. Register mutator

Now, it's time to add mutator to Infection's config and enable it:

```diff
// infecion.json5

{
    "mutators": {
        "@default": true,
+       "App\\Mutator\\AnyStringToInfectedMutator": true
    },
}
```

# 3. Check documentation

And let's check if Infection sees it by running

```bash
bin/infection describe App\\Mutator\\AnyStringToInfectedMutator 
```

This should display information from `AnyStringToInfectedMutator::getDefinition()` method. 

<br/>

# 4. Mutate the code!

It's time to mutate the code with our own cool mutator. You can run Infection as you usually do, or just with 1 file to quickly get the feedback:

```bash
bin/infection  --filter=src/SomeFileInYourProject.php  ...
```

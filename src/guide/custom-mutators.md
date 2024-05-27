---
title: Custom Mutators
type: guide
order: 60
is_new: true
---

Starting from Infection 0.29.0, it's possible to create custom mutators that can be used by Infection.

> Before creating mutator, make sure it's not already supported by Infection itself by looking into our [built-in mutators](/guide/mutators.html). Don't forget to share results, probably your new mutator can be added to Infection core!

# How to create a custom mutator

Imaging we want to create a mutator that replaces any string with `Infected!`, like this:

```diff
- throw new RuntimeException('File not found');
+ throw new RuntimeException('Infected!');
```

## 1. Install `infection/mutator` and create a class that implements `Mutator` interface

> If you want to use our mutator generator, additionally install `infection/infection` as a **dev** dependency and run `vendor/bin/infection make:mutator`. Otherwise, create it manually as shown below.

<p class="tip">Never install Infection as a production dependency</p>
 
Custom Mutator must implement `Mutator` interface which is located in `infection/mutator` package. Install it by:

```bash
composer require infection/mutator
```

Then, create a class that implements this interface:

```php
<?php

declare(strict_types=1);

namespace App\Mutator;

use Infection\Mutator\Definition;
use Infection\Mutator\Mutator;
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
        
    public function getName(): string
    {
        return self::class;
    }
}
```

- `canMutate()` method is used to determine if the current mutator can mutate the node during traversing AST. What we are interested in here is `Node\Scalar\String_` class that represents strings in `nikic/php-parser` lib.

  > How to know which AST node you need to use in `Mutator::canMutate()`? You can play wih [AST Explorer](https://infection-php.dev/ast), by writing simple source code and clicking to AST nodes.

- `mutate()` method is the code where our mutation happens. This method is only executed if `canMutate()` returns `true` for a `Node`, so we always know that an instance of `Node\Scalar\String_` is passed to `mutate()`. What we do here is just creating a new `Node\Scalar\String_` instance passing `Infected!` string, and preserve original node attributes (internal things like position of the node and others). Make sure to always create new nodes with keeping original attributes.
- `getDefinition()` is a method that returns information about new mutator: its description, category and diff between original and mutated code. Make sure to always add details here. This will be used for documentation and `bin/infection describe` command.

## 2. Register mutator

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

## 3. Check documentation

And let's check if Infection sees it by running

```bash
bin/infection describe App\\Mutator\\AnyStringToInfectedMutator 
```

This should display information from `AnyStringToInfectedMutator::getDefinition()` method. 

## 4. Mutate the code!

It's time to mutate the code with our own cool mutator. You can run Infection as you usually do, or just with this new mutator to quickly get the feedback:

```bash
bin/infection  --mutators="App\\Mutator\\AnyStringToInfectedMutator" --show-mutations
```

## 5. Test your mutator

In order to write quality tests for your mutator, we highly recommend to use our generator and `BaseMutatorTestCase` from `infection/infection`:

```bash
composer require infection/infection --dev

vendor/bin/infection make:mutator AnyStringToInfectedMutator
```

This will create mutator and a test file that you need to move to tests folders and complete by adding test cases. In our example, the test file would like this:

```php
<?php

declare(strict_types=1);

namespace App\Tests;

use Infection\Testing\BaseMutatorTestCase;
use PHPUnit\Framework\Attributes\CoversClass;
use PHPUnit\Framework\Attributes\DataProvider;
use App\Mutator\AnyStringToInfectedMutator;

#[CoversClass(AnyStringToInfectedMutator::class)]
final class AnyStringToInfectedMutatorTest extends BaseMutatorTestCase
{
    protected function getTestedMutatorClassName(): string
    {
        return AnyStringToInfectedMutator::class;
    }

    /**
     * @param string|string[] $expected
     */
    #[DataProvider('mutationsProvider')]
    public function test_it_can_mutate(string $input, string|array|null $expected = []): void
    {
        $this->assertMutatesInput($input, $expected);
    }

    public static function mutationsProvider(): iterable
    {
        yield 'It mutates a simple case' => [
            <<<'PHP'
                <?php

                throw new RuntimeException('File not found');
                PHP
            ,
            <<<'PHP'
                <?php

                throw new RuntimeException('Infected!');
                PHP
            ,
        ];
        
        yield 'It does not mutate non-string arguments' => [
            <<<'PHP'
                <?php

                throw new RuntimeException(SOME_CONST);
                PHP
            ,
        ];
    }
}
```

# Understanding `Node` attributes

PHP-Parser lib adds for each `Node` instance different attributes, that can be accessed like this:

```php
$attributes = $node->getAttributes();
```

Infection also adds additional attributes that can be very useful for custom mutators:

## `parent` attribute

Sometimes, in order to decide whether mutator needs to (not) mutate a `Node`, we need to look to parent nodes.

For example, built-in `TrueValue` mutator replaces `true` with `false`. But we don't want to do a replacement if it's the 3rd argument of `in_array()` function. But in order to check where `true` is used, we need to travers up to the AST.

This is where 'parent' attribute can help you;

```php
// Mutator::caMutate() method

$parent = $node->getAttribute('parent');

// do something with $parent 
```

Look [here](https://github.com/infection/infection/blob/80a15797ad47ad54658a24bdfa2d509964269988/src/Mutator/Boolean/TrueValue.php#L101-L110) to see how it's used in a real `TrueValue` mutator.

## Reflection attributes

### `reflectionClass`

All nodes inside a class has `reflectionClass` attribute, which contains `\ReflectionClass` instance of the class where the node is located.

This can be useful in many places. Infection, for example, uses it to determine if a class has parents with the same method as being mutated in [`PublicVisibility`](https://github.com/infection/infection/blob/80a15797ad47ad54658a24bdfa2d509964269988/src/Mutator/FunctionSignature/PublicVisibility.php#L107-L113) mutator.

```php
/** @var \ClassReflection $reflection */
$reflection = $node->getAttribute('reflectionClass');
```

### `isInsideFunction`

This boolean attribute is set to `true` if the node is inside a function/method. For example, Infection uses it to not mutate the code outside of methods of classes.

```php
$isInsideFunction = $node->getAttribute('isInsideFunction');
```

### `isOnFunctionSignature`

This boolean attribute is set to `true` if the node is on a function/method signature line. 

```php
public function foo(bool $someBoolean = true): void
{
    // ...
}
```

In this example, we can determine if `true` is on a function signature line thanks to this attribute.

```php
$isOnFunctionSignature = $node->getAttribute('isOnFunctionSignature');
```

### `functionScope`

This attribute contains an instance of `Node\Stmt\Function_` or `null`. `Node\Stmt\Function_` can be used to get the return type of the currently mutated function. See [how it's done](https://github.com/infection/infection/blob/80a15797ad47ad54658a24bdfa2d509964269988/src/Mutator/ReturnValue/ArrayOneItem.php#L129-L142) in `ArrayOneItem` mutator.

```php
/** @var Node\Stmt\Function_|null $functionScope */
$functionScope = $node->getAttribute('functionScope');

$returnType = $functionScope->getReturnType();
```

### `functionName`

This attribute contains the name of the function/method where the node is located. It can be useful to determine if the node is inside a specific function that, for example, needs to be ignored in mutation logic.

```php
$methodName = $node->getAttribute('functionName');
```

## `NameResolver` attributes

Infection uses php-parser's `NameResolver` visitor that adds `namespacedName` **property** to a node, `resolvedName` or `namespacedName` attributes.

This visitor is configured in Infection with:

```php
[
    'preserveOriginalNames' => true,
    'replaceNodes' => false,
]
```

Refer to [its documentation](https://github.com/nikic/PHP-Parser/blob/c5ee33df86c06b3278c670f64273b1ba768a0744/doc/component/Name_resolution.markdown) to understand how it works. In a nutshell, thanks to this visitor, you can get fully qualified class names or function names in the code.

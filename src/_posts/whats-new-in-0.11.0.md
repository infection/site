layout: post
title: What's new in Infection 0.11.0
date: 2018-11-12 17:23:31
type: '{{type}}'
---

Release: https://github.com/infection/infection/releases/tag/0.11.0

## BC Breaks

Before upgrading, make sure you know about backward incompatible changes.

The following mutators have beed *removed* from the `@default` profile:

* `==` → `===` 
* `!=` → `!==` 
* `===` → `==` 
* `!==` → `!=`

In order to use them, you should explicitly enable them in `infection.json`. 


## New features and enhancements

### Random order of tests for PHPUnit

Did you know that PHPUnit can run the tests in a random order out of the box, starting from version `7.2`?

Now, Infection will use this feature and run your tests randomized in order to check if they pass during the so-called "Initial Tests Run" step.

#### Why is it needed?

It's needed to be sure that the tests in your project do not have hidden dependencies. During mutation testing, Infection executes only those tests for each Mutant, that covers a mutated line of the code. And the order of those tests is always `fastest - first`. 

Thus, if the sorted order differs from the default one, and it leads to tests fail because of tests dependencies, Infection will incorrectly mark such Mutant as _killed_ which will impact MSI.

#### How does it works?

The following attributes are added to `phpunit.xml`:

* `executionOrder="random"`
* `resolveDependencies="true"`

#### Why do we need `resolveDependencies`?

If some tests depend on each other through `@depends` annotation, then running them in a random order will lead to [skipped broken tests](https://github.com/epdenouden/phpunit/wiki/PHPUnit-test-running-order-management#demo-3-handling-dependencies). To avoid reordering such dependent tests and still use randomness, we should use `resolveDependencies="true"` (or `--resolve-dependencies` option)

Read more about this PHPUnit feature: https://github.com/epdenouden/phpunit/wiki/PHPUnit-test-running-order-management#demo-3-handling-dependencies

### PHPUnit's `@codeCoverageIgnore` annotations support

Infection now supports `@codeCoverageIgnore` annotation on class and method level.

The following class will not be mutated, because it does not produce any code coverage.

```php
/**
 * @codeCoverageIgnore
 */
class Calculator
{
    public function add(float $a, float $b): float
    {
        return $a + $b;
    }
}
```
 
In this example, method `generate()` will be skipped from mutation logic, but `getDependencies()` will be mutated as the usual method.
 
```php
class ProductFixture
{
    /**
     * @codeCoverageIgnore
     */
    public function generate(): void
    {
        // generate logic
    }
    
    public function getDependencies(): array
    {
        return [CategoryFixture::class];
    }
}
```

### `infection.json` schema validation

We are constantly improving DX in Infection and one of the new enhancements is a JSON Schema validation of `infection.json`.

No more typos, extra fields and incorrect keys!

### `phpunit.xml` XSD validation

One of the most popular issues when Infection does not work properly on your projects is when there is an invalid `phpunit.xml`. In order to reduce the number of such issues, we've added XSD validation.

It works with a remote and a local XSD files:

* `https://schema.phpunit.de/6.1/phpunit.xsd`
* `./vendor/phpunit/phpunit/phpunit.xsd'`

Just make sure you have it in your `phpunit.xml`:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit 
   xsi:noNamespaceSchemaLocation="./vendor/phpunit/phpunit/phpunit.xsd" 
   xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
   <!-- config -->
</phpunit>
```

### Multiple mutations from one Mutator

Previously, one Mutator class could produce only one Mutation. For example `Plus` mutator mutates binary `+` operator to binary `-`

```diff
- $a = $b + $c;
+ $a = $b - $c;
```

It works fine, but in practice we found more complex cases where it would be easier to mutate one `Node` to multiple `Node`s from the same class. For example, let's look at the `RoundingFamily` Mutator.

1. it mutates `floor()` to `ceil()` AND `round()`
2. it mutates  `ceil()` to `floor()` AND `round()`
3. it mutates `round()` to `ceil()` AND `floor()`

This is possible thanks to Generators. Now each Mutator can `yield` as many mutations as needed.

```diff
- $result = round($percentage, 2);
+ $result = ceil($percentage);
+ $result = floor($percentage);
```

## New Mutators

### `RoundingFamily`

1. it mutates `floor()` to `ceil()` AND `round()`
2. it mutates  `ceil()` to `floor()` AND `round()`
3. it mutates `round()` to `ceil()` AND `floor()`

-----

We've added a new mutators profile that unwraps parameters from functions.

Note that some of them produce multiple mutations depending on the number of possible arguments.

### `UnwrapArrayChunk`

This mutator takes the first argument of `array_chunk()` function and assigns it to the variable. Are your tests ready to kill such Mutant?

```diff
- $a = array_chunk(['A', 'B', 'C'], 2);
+ $a = ['A', 'B', 'C'];
```

### `UnwrapArrayCombine`

```diff
- $a = array_combine(['A', 'B', 'C'], ['foo', 'bar', 'baz']);
+ $a = ['A', 'B', 'C'];
```
 
 
### `UnwrapArrayDiff`
 
```diff
- $a = array_diff(['A', 'B', 'C'], ['D']);
+ $a = ['A', 'B', 'C']
```
 
### `UnwrapArrayFilter`
 
```diff
- $a = array_filter(['A', 1, 'C'], 'is_int');
+ $a = ['A', 'B', 'C'];
```

### `UnwrapArrayFlip`
 
```diff
- $a = array_flip(['A', 'B', 'C']);
+ $a = ['A', 'B', 'C'];
```

### `UnwrapArrayIntersect`
 
```diff
- $a = array_intersect(['A', 'B', 'C'], ['D']);
+ $a = ['A', 'B', 'C'];
```

### `UnwrapArrayKeys`
 
```diff
- $a = array_keys(['foo' => 'bar']);
+ $a = ['foo' => 'bar'];
```

### `UnwrapArrayMap`
 
```diff
- $a = array_map('strtolower', ['A', 'B', 'C'], \Class_With_Const::Const, $foo->bar());
+ $a = ['A', 'B', 'C'];
+ $a = \Class_With_Const::Const;
+ $a = $foo->bar();
```

### `UnwrapArrayMerge`
 
```diff
- $a = array_merge(['A', 'B', 'C'], ['D']);
+ $a = ['A', 'B', 'C'];
+ $a = ['D'];
```

### `UnwrapArrayReduce`
 
```diff
- $a = array_reduce(['A', 'B', 'C'], $callback, ['D']);
+ $a = ['D'];
```

### `UnwrapArrayReplace`
 
```diff
- $a = array_replace(['A', 'B', 'C'], ['D']);
+ $a = ['A', 'B', 'C'];
```

### `UnwrapArrayReplaceRecursive`
 
```diff
- $a = array_replace_recursive(['A', 1, 'C'], ['D'], ['E', 'F']);
+ $a = ['A', 1, 'C'];
+ $a = ['D'];
+ $a = ['E', 'F'];
```

### `UnwrapArrayReverse`
 
```diff
- $a = array_reverse(['A', 'B', 'C']);
+ $a = ['A', 'B', 'C'];
```

### `UnwrapArrayUnique`
 
```diff
- $a = array_unique(['foo', 'bar', 'bar']);
+ $a = ['foo', 'bar', 'bar'];
```

### `UnwrapArrayValues`
 
```diff
- $a = array_values(['foo' => 'bar']);
+ $a = ['foo' => 'bar'];
```

Getting bored? A couple of string-related mutators:

### `UnwrapStrRepeat`
 
```diff
- $a = str_repeat('A', 3);
+ $a = 'A';
```

### `UnwrapStrToLower`
 
```diff
- $a = strtolower('Hello!');
+ $a = 'Hello!';
```

### `UnwrapStrToUpper`
 
```diff
- $a = strtoupper('Hello!');
+ $a = 'Hello!';
```
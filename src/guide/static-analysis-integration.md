---
title: Static Analysis Integration
type: guide
order: 35
is_new: true
---

<span class="version-since">PHPStan integration: available in Infection 0.30.0+</span> <span class="version-since">Mago integration: available in Infection 0.32.7+</span>

Static Analysis Integration helps improve mutation testing effectiveness by catching logical errors that tests might miss, such as:

- Type violations
- Dead code detection
- Unreachable code paths


If you come from a statically typed language with AoT compilers, you may be confused about the scope of this feature, but in the PHP ecosystem, producing runnable code that does not respect the type system is very easy, and mutation testing tools do this all the time.

Consider this example (credit: [Roave/infection-static-analysis-plugin](https://github.com/Roave/infection-static-analysis-plugin#background)):

```php
/**
 * @template T
 * @param array<T> $values
 * @return list<T>
 */
function makeAList(array $values): array
{
    return array_values($values);
}
```

Given a test like:

```php
function test_makes_a_list(): void
{
    $list = makeAList(['a' => 'b', 'c' => 'd']);

    assert(count($list) === 2);
    assert(in_array('b', $list, true));
    assert(in_array('d', $list, true));
}
```

A mutation testing framework will produce the following mutation, since the test does not verify the output precisely enough:

```diff
 function makeAList(array $values): array
 {
-    return array_values($values);
+    return $values;
 }
```

Such mutant is escaped one because tests don't detect this change. At the same time, this mutated code is valid PHP, but violates the `@return list<T>` type declaration. A static analysis tool can detect that the actual return value is no longer a `list<T>` but a map of `array<int|string, T>`, and kill this mutant — preventing you from having to write an unnecessary test.

Infection supports [`phpstan`](https://phpstan.org/) and [`mago`](https://mago.carthage.software/) as static analysis tools. To enable the integration, install the tool and set `staticAnalysisTool` in your config:

```js
{
    "staticAnalysisTool": "phpstan" // or "mago"
}
```

or [pass it via CLI](/guide/command-line-options.html#static-analysis-tool):

```bash
infection --static-analysis-tool=phpstan
infection --static-analysis-tool=mago
```

> Note: This is an opt-in feature. Static analysis is only performed on mutants that _escape_ the test suite, ensuring optimal performance.

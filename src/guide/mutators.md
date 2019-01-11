---
title: Mutators
type: guide
order: 5
---

Infection supports a set of Mutators which are based on AST and [PHP-Parser](https://github.com/nikic/PHP-Parser) project.

> [Read more](./command-line-options.html#--mutators) about how to execute only particular set of mutators using `Name` column

### Function Signature

| Name     | Original | Mutated |
| :------: | :------: |:-------:|
| PublicVisibility | `public function ...` | `protected function ...` |
| ProtectedVisibility | `protected function ...` | `private function ...` |

To verify that the visibility of a method is necessary. If the visibility of a method can be reduced from `public` to `protected` or `private`, this may be an indication that the publicly accessible part of API of a class is larger than what’s strictly necessary. This mutator will drive the source code towards classes with smaller publicly accessible APIs and thus better encapsulation.

### Unwrap Function

The Unwrap* mutator family will unwrap function parameters.

| Name     | Original | Mutated |
| :------: | :------: |:-------:|
| UnwrapArrayChangeKeyCase | `$a = array_change_key_case(['foo' => 'bar']);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayChunk | `$a = array_chunk(['A', 'B', 'C'], 2);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayColumn | `$a = array_column([['foo' => 'bar]], 'foo');` | `$a = [['foo' => 'bar]];` |
| UnwrapArrayCombine | `$a = array_combine(['A', 'B', 'C'], ['foo', 'bar', 'baz']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayDiff | `$a = array_diff(['A', 'B', 'C'], ['D']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayDiffAssoc | `$a = array_diff_assoc(['foo' => 'bar'], ['baz' => 'bar]);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayDiffKey | `$a = array_diff_key(['foo' => 'bar'], ['baz' => 'bar]);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayDiffUassoc | `$a = array_diff_assoc(['foo' => 'bar'], ['baz' => 'bar], $callback);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayDiffUkey | `$a = array_diff_ukey(['foo' => 'bar'], ['baz' => 'bar], $callable);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayFilter | `$a = array_filter(['A', 1, 'C'], 'is_int');` | `$a = ['A', 1, 'C'];` |
| UnwrapArrayFlip | `$a = array_flip(['A', 'B', 'C']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayIntersect | `$a = array_intersect(['A', 'B', 'C'], ['D']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayIntersectKey | `$a = array_intersect_key(['foo' => 'bar'], ['bar' => 'baz']);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayIntersectUassoc | `$a = array_intersect_uassoc(['foo' => 'bar'], ['bar' => 'baz']);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayIntersectUkey | `$a = array_intersect_ukey(['foo' => 'bar'], ['bar' => 'baz']);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayKeys | `$a = array_keys(['foo' => 'bar']);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayMap | `$a = array_map('strtolower', ['A', 'B', 'C']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayMerge | `$a = array_merge(['A', 'B', 'C'], ['D']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayMergeRecursive | `$a = array_merge_recursive(['A', 'B', 'C'], ['D']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayReduce | `$a = array_reduce(['A', 'B', 'C'], $callback, ['D']);` | `$a = ['D'];` |
| UnwrapArrayReplace | `$a = array_replace(['A', 'B', 'C'], ['D']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayReplaceRecursive | `$a = array_replace_recursive(['A', 'B', 'C'], ['D']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayReverse | `$a = array_reverse(['A', 'B', 'C']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArraySlice | `$a = array_slice(['A', 'B', 'C'], 1);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArraySplice | `$a = array_splice(['A', 'B', 'C'], 1);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayUnique| `$a = array_unique(['foo', 'bar', 'bar']);` | `$a = ['foo', 'bar', 'bar'];` |
| UnwrapArrayValues | `$a = array_values(['foo' => 'bar']);` | `$a = ['foo' => 'bar'];` |
| UnwrapStrRepeat | `$a = str_repeat('A', 3);` | `$a = 'A';` |
| UnwrapStrToLower | `$a = strtolower('Hello!');` | `$a = 'Hello!';` |
| UnwrapStrToUpper | `$a = strtoupper('Hello, world!');` | `$a = 'Hello, world!';` |

### Binary Arithmetic

| Name | Original | Mutated |
| :------: |:-------:| :------: |
| Plus | + | - |
| Minus | - | + |
| Multiplication | * | / |
| Division | / | * |
| Modulus | % | * |
| Exponentiation | ** | / |
| MulEqual | *= | /= |
| PlusEqual | += | -= |
| MinusEqual | -= | += |
| DivEqual | /= | *= |
| ModEqual | %= | *= |
| PowEqual | **= | /= |
| BitwiseAnd | & | &#124; |
| BitwiseOr | &#124; | & |
| BitwiseXor | ^ | & |
| BitwiseNot | ~ |  |
| ShiftRight | >> | << |
| ShiftLeft | << | >> |
| AssignmentEqual | == | = |
| Assignment | += | = |
| Assignment | -= | = |
| Assignment | *= | = |
| Assignment | **= | = |
| Assignment | /= | = |
| Assignment | %= | = |
| Assignment | .= | = |
| Assignment | &= | = |
| Assignment | &#124;= | = |
| Assignment | ^= | = |
| Assignment | <<= | = |
| Assignment | >>= | = |

### Round Family

The Round Family mutator will make sure that there's enough tests to cover the rounding possibilities.

| Name | Original | Mutated |
| :------: |:-------:| :------: |
| RoundingFamily | `round()` | `floor()` |
| RoundingFamily | `round()` | `ceil()` |
| RoundingFamily | `ceil()` | `floor()` |
| RoundingFamily | `ceil()` | `round()` |
| RoundingFamily | `floor()` | `round()` |
| RoundingFamily | `floor()` | `ceil()` |

### Boolean Substitution

This temporarily encompasses logical mutators.

| Name | Original | Mutated |
| :------: | :------: |:-------:|
| ArrayItem | `[$a->foo => $b->bar]` | `[$a->foo > $b->bar]` |
| TrueValue | true | false |
| FalseValue | false | true |
| LogicalAnd | && | &#124;&#124; |
| LogicalOr | &#124;&#124; | && |
| LogicalLowerAnd | and | or |
| LogicalLowerOr | or | and |
| LogicalNot | ! | &nbsp; |
| Yield_ | `yield $a => $b;` | `yield $a > $b;` |
| Coalesce | `$a ?? $b` | `$b` |

### Conditional Boundaries

| Name | Original | Mutated
| :------: | :------: |:-------:
| GreaterThan | >        | >= |
| LessThan | <        | <= |
| GreaterThanOrEqualTo | >=       | > |
| LessThanOrEqualTo | <=       | < |

### Equal or Identical Checks

| Name | Original | Mutated
| :------: | :------: |:-------:
| EqualIdentical | `==` | `===` |
| NotEqualNotIdentical | `!=` | `!==` |
| IdenticalEqual | `===` | `==` |
| NotIdenticalNotEqual | `!==` | `!=` |

> These mutators are disabled by default, you can use the `@equal` or `@identical` profiles to enable the ones you prefer.

### Negated Conditionals

| Name | Original | Mutated |
| :------: | :------: |:-------:|
| Equal | == | != |
| NotEqual | != | == |
| Identical | === | !== |
| NotIdentical | !== | === |
| GreaterThanNegotiation | > | <= |
| LessThanNegotiation | < | >= |
| GreaterThanOrEqualToNegotiation | >= | < |
| LessThanOrEqualToNegotiation | <= | > |


### Increments

| Name | Original | Mutated |
| :------: | :------: |:-------:|
| Increment | ++ | \-\- |
| Decrement | \-\- | ++ |


### Return Values

| Name | Original | Mutated |
| :------: | :------: |:-------:|
| TrueValue | return true; | return false; |
| FalseValue | return false; | return true; |
| OneZeroInteger |  return 0; | return 1; |
| IntegerNegation | return `(Any Integer)`; | return `-(Any Integer)`; |
| OneZeroFloat | return 0.0; | return 1.0; |
| OneZeroFloat | return 1.0; | return 0.0; |
| FloatNegation | return `(Any Float)`; | return `-(Any Float)`; |
| This | return $this; | return null; |
| FunctionCall | return function(); | function(); return null; |
| NewObject | return new Class(); | new Class(); return null; |

### Removal Mutators

| Name | Original | Mutated |
| :------: | :------: |:-------:|
| FunctionCallRemoval | foo_bar($a) | -
| MethodCallRemoval | $this->method($var) | -

### Loop

| Name | Original | Mutated |
| :------: | :------: |:-------:|
| Break_ | break; | continue; |
| Continue_ | continue; | break; |
| Foreach_ | foreach ($someVar as ...); | foreach ([] as ...); |
| For_ | for ($i=0; $i < 10; $i++); | for ($i=0; false; $i++); |

### Sorting

| Name | Original | Mutated |
| :------: | :------: |:-------:|
| Spaceship | $a <=> $b | $b <=> $a |


### Literal Numbers

| Name | Original | Mutated |
| :------: | :------: |:-------:|
| OneZeroInteger | 0 | 1 |
| OneZeroInteger | 1 | 0 |
| OneZeroFloat | 0.0 | 1.0 |
| OneZeroFloat | 1.0 | 0.0 |
| DecrementInteger | 7 | 6 |
| IncrementInteger | 7 | 8 |

### Exceptions

| Name | Original | Mutated |
| :------: | :------: |:-------:|
| Throw_ | `throw new NotFoundException();` | `new NotFoundException();` |
| Finally_ | `try {} catch (\Exception $e) {} finally {}` | `try {} catch (\Exception $e) {}` |

### Type Casting

| Name | Original | Mutated |
| :------: | :------: |:-------:|
| CastArray | `(array) $value;` | `$value` |
| CastBool | `(bool) $value;` | `$value` |
| CastFloat | `(float) $value;` | `$value` |
| CastInt | `(int) $value;` | `$value` |
| CastObject | `(object) $value;` | `$value` |
| CastString | `(string) $value;` | `$value` |

### Regex
| Name | Original | Mutated |
| :------: | :------: |:-------:|
| PregQuote | `$a = preg_quote('text');` | `$a = 'text';` |
| PregMatchMatches | `preg_match('/pattern/', $value, $matches);` | `(int) $matches = array();` |

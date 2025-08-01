---
title: Mutators
type: guide
order: 50
---

Infection supports a set of Mutators which are based on AST and [PHP-Parser](https://github.com/nikic/PHP-Parser) project.

> [Read more](./command-line-options.html#--mutators) about how to execute only particular set of mutators using `Name` column

> Run the `infection describe` command to get information about mutators, right from the command line.

### Function Signature

| Name     | Original | Mutated |
| :------: | :------: |:-------:|
| [PublicVisibility](https://infection-php.dev/r/qxk) | `public function ...` | `protected function ...` |
| [ProtectedVisibility](https://infection-php.dev/r/j0l) | `protected function ...` | `private function ...` |

To verify that the visibility of a method is necessary. If the visibility of a method can be reduced from `public` to `protected` or `private`, this may be an indication that the publicly accessible part of API of a class is larger than what’s strictly necessary. This mutator will drive the source code towards classes with smaller publicly accessible APIs and thus better encapsulation.

### Unwrap Function

The Unwrap* mutator family will unwrap function parameters.

| Name     | Original | Mutated |
| :------ | :------ |:------- |
| UnwrapArrayChangeKeyCase | `$a = array_change_key_case(['foo' => 'bar']);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayChunk | `$a = array_chunk(['A', 'B', 'C'], 2);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayColumn | `$a = array_column([['foo' => 'bar]], 'foo');` | `$a = [['foo' => 'bar]];` |
| UnwrapArrayCombine | `$a = array_combine(['A', 'B', 'C'], ['foo', 'bar', 'baz']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayDiff | `$a = array_diff(['A', 'B', 'C'], ['D']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayDiffAssoc | `$a = array_diff_assoc(['foo' => 'bar'], ['baz' => 'bar]);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayDiffKey | `$a = array_diff_key(['foo' => 'bar'], ['baz' => 'bar]);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayDiffUassoc | `$a = array_diff_assoc(['foo' => 'bar'], ['baz' => 'bar], $keyCompareFunc);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayDiffUkey | `$a = array_diff_ukey(['foo' => 'bar'], ['baz' => 'bar], $keyCompareFunc);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayFilter | `$a = array_filter(['A', 1, 'C'], 'is_int');` | `$a = ['A', 1, 'C'];` |
| UnwrapArrayFlip | `$a = array_flip(['A', 'B', 'C']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayIntersect | `$a = array_intersect(['A', 'B', 'C'], ['D']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayIntersectAssoc | `$a = array_intersect_assoc(['A', 'B', 'C'], ['D']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayIntersectKey | `$a = array_intersect_key(['foo' => 'bar'], ['bar' => 'baz']);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayIntersectUassoc | `$a = array_intersect_uassoc(['foo' => 'bar'], ['bar' => 'baz'], $keyCompareFunc);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayIntersectUkey | `$a = array_intersect_ukey(['foo' => 'bar'], ['bar' => 'baz'], $keyCompareFunc);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayKeys | `$a = array_keys(['foo' => 'bar']);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayMap | `$a = array_map('strtolower', ['A', 'B', 'C']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayMerge | `$a = array_merge(['A', 'B', 'C'], ['D']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayMergeRecursive | `$a = array_merge_recursive(['A', 'B', 'C'], ['D']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayPad | `$a = array_pad(['A'], 2, 'B');` | `$a = ['A'];` |
| UnwrapArrayReduce | `$a = array_reduce(['A', 'B', 'C'], $callback, ['D']);` | `$a = ['D'];` |
| UnwrapArrayReplace | `$a = array_replace(['A', 'B', 'C'], ['D']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayReplaceRecursive | `$a = array_replace_recursive(['A', 'B', 'C'], ['D']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayReverse | `$a = array_reverse(['A', 'B', 'C']);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArraySlice | `$a = array_slice(['A', 'B', 'C'], 1);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArraySplice | `$a = array_splice(['A', 'B', 'C'], 1);` | `$a = ['A', 'B', 'C'];` |
| UnwrapArrayUdiff | `$a = array_udiff(['foo' => 'bar'], ['baz' => 'bar], $valueCompareFunc);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayUdiffAssoc | `$a = array_udiff_assoc(['foo' => 'bar'], ['baz' => 'bar], $valueCompareFunc);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayUdiffUassoc | `$a = array_udiff_uassoc(['foo' => 'bar'], ['baz' => 'bar], $valueCompareFunc, $keyCompareFunc);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayUintersect | `$a = array_uintersect(['foo' => 'bar'], ['baz' => 'bar], $valueCompareFunc);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayUintersectAssoc | `$a = array_uintersect_assoc(['foo' => 'bar'], ['baz' => 'bar], $valueCompareFunc);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayUintersectUassoc | `$a = array_uintersect_uassoc(['foo' => 'bar'], ['baz' => 'bar], $valueCompareFunc, $keyCompareFunc);` | `$a = ['foo' => 'bar'];` |
| UnwrapArrayUnique| `$a = array_unique(['foo', 'bar', 'bar']);` | `$a = ['foo', 'bar', 'bar'];` |
| UnwrapArrayValues | `$a = array_values(['foo' => 'bar']);` | `$a = ['foo' => 'bar'];` |
| UnwrapLcFirst | `$a = lcfirst('Hello, world!');` | `$a = 'Hello, world!';` |
| UnwrapLtrim | `$a = ltrim(' Hello, world!');` | `$a = ' Hello, world!';` |
| UnwrapRtrim | `$a = rtrim('Hello, world! ');` | `$a = 'Hello, world! ';` |
| UnwrapStrIreplace | `$a = str_ireplace('Afternoon', 'Evening' ,'Good Afternoon!');` | `$a = 'Good Afternoon!';` |
| UnwrapStrRepeat | `$a = str_repeat('A', 3);` | `$a = 'A';` |
| UnwrapStrReplace | `$a = str_replace('Afternoon', 'Evening' ,'Good Afternoon!');` | `$a = 'Good Afternoon!';` |
| UnwrapStrRev | `$a = strrev('Hello!');` | `$a = 'Hello!'; |
| UnwrapStrShuffle | `$a = str_shuffle('Hello!');` | `$a = 'Hello!';` |
| UnwrapSubstr | `$a = substr('Hello!', 0, -1);` | `$a = 'Hello!';` |
| UnwrapStrToLower | `$a = strtolower('Hello!');` | `$a = 'Hello!';` |
| UnwrapStrToUpper | `$a = strtoupper('Hello, world!');` | `$a = 'Hello, world!';` |
| UnwrapTrim | `$a = trim(' Hello, world! ');` | `$a = 'Hello, world!';` |
| UnwrapUcFirst | `$a = ucfirst('hello, world!');` | `$a = 'hello, world!';` |
| UnwrapUcWords | `$a = ucwords('hello, world!');` | `$a = 'hello, world!';` |

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
| Assignment Coalesce | ??= | = |

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

### Boolean

|              Name               |         Original         |                       Mutated                       |
|:-------------------------------:|:------------------------:|:---------------------------------------------------:|
|            ArrayAll             |      `array_all()`       |                        true                         |
|            ArrayAny             |      `array_any()`       |                        true                         |
|            ArrayItem            |  `[$a->foo => $b->bar]`  |                `[$a->foo > $b->bar]`                |
|            TrueValue            |           true           |                        false                        |
|           FalseValue            |          false           |                        true                         |
|           InstanceOf_           |    `$a instanceof B`     |                  `true` / `false`                   |
|           LogicalAnd            |            &&            |                    &#124;&#124;                     |
|            LogicalOr            |       &#124;&#124;       |                         &&                          |
|         LogicalLowerAnd         |           and            |                         or                          |
|         LogicalLowerOr          |            or            |                         and                         |
|           LogicalNot            |            !             |                       &nbsp;                        |
|             Yield_              |    `yield $a => $b;`     |                  `yield $a > $b;`                   |
|  LogicalAndAllSubExprNegation   |     `$a = $b && $c;`     |                 `$a = !$b && !$c;`                  |
|       LogicalAndNegation        |     `$a = $b && $c;`     |                 `$a = !($b && $c);`                 |
| LogicalAndSingleSubExprNegation |     `$a = $b && $c;`     |        `$a = !$b && $c;`, `$a = $b && !$c;`         |
|   LogicalOrAllSubExprNegation   | $a = $b &#124;&#124; $c; |             $a = !$b &#124;&#124; !$c;              |
|        LogicalOrNegation        | $a = $b &#124;&#124; $c; |             $a = !($b &#124;&#124; $c);             |
| LogicalOrSingleSubExprNegation  | $a = $b &#124;&#124; $c; | $a = !$b &#124;&#124, $c; $a = $b &#124;&#124; !$c; |

#### `TrueValue`

Default settings:

* `in_array: false`: whether to mutate 3rd argument `true` in function call
* `array_search: false`: whether to mutate 3rd argument `true` in function call

infection.json5:

```json
{
    "mutators": {
        "TrueValue": {
            "settings": {
                "in_array": true,
                "array_search": true
            }
        }
     }
}
```

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

### Operator

|         Name         | Original | Mutated |
|:--------------------:| :------: |:-------:|
|        Catch_        | `catch (\Throwable&#124;\DomainException $e)` | `catch (\DomainException $e)` `catch (\DomainException $e)` |
|       Coalesce       | `$foo ?? $bar` | `$bar ?? $foo` |
|        Concat        | `$foo . $bar` | `$bar . $foo` |
|  NullSafeMethodCall  | `$object?->getObject()` | `$object->getObject()` |
| NullSafePropertyCall | `$object?->property` | `$object->property` |
|   SpreadAssignment   | `$array = [...$collection]` | `$array = $collection` |
|    SpreadOneItem     | `[...$collection, 2, 3]` | `[[...$collection][0], 2, 3]` |
|    SpreadRemoval     | `[...$collection, 2, 3]` | `[$collection, 2, 3]` |
|       Ternary        | `isset($b) ? 'B' : 'C'` | `isset($b) ? 'C' : 'B'` |
|    ElseIfNegation    | `} elseif ($this->bar()) {` | `} elseif (!$this->bar()) {` |
|      IfNegation      | `if ($this->fooBar()) {` | `if (!$this->fooBar()) {` |


### Increments

| Name | Original | Mutated |
| :------: | :------: |:-------:|
| Increment | ++ | \-\- |
| Decrement | \-\- | ++ |


### Return Values

| Name | Original | Mutated |
| :------: | :------: |:-------:|
| ArrayOneItem | return $collection; | return count($collection) > 1 ? array_slice($collection, 0, 1, true) : $collection; |
| TrueValue | return true; | return false; |
| FalseValue | return false; | return true; |
| IntegerNegation | return `(Any Integer)`; | return `-(Any Integer)`; |
| OneZeroFloat | return 0.0; | return 1.0; |
| OneZeroFloat | return 1.0; | return 0.0; |
| FloatNegation | return `(Any Float)`; | return `-(Any Float)`; |
| This | return $this; | return null; |
| FunctionCall | return function(); | function(); return null; |
| NewObject | return new Class(); | new Class(); return null; |
| YieldValue | yield $key => $value; | yield $value; |

### Removal Mutators

| Name | Original | Mutated |
| :------: | :------: |:-------:|
| ArrayItemRemoval | `[1, $a, '3']` | `[$a, '3']` *depending on configuration*
| FunctionCallRemoval | foo_bar($a) | -
| MethodCallRemoval | $this->method($var) | -
| CatchBlockRemoval | `try {} catch (\DomainException $e) {} catch (\Throwable $e) {}` | `try {} catch (\DomainException $e) {}` `try {} catch (\Throwable $e) {}`
| MatchArmRemoval | `match ($x) { 1 => null, default => throw new \Exception()};` | `match ($x) { default => throw new \Exception()};` `match ($x) { 1 => null};`
| CloneRemoval | clone (new stdClass()) | new stdClass()
| ConcatOperandRemoval | `'foo' . 'bar'` | `'bar'` and `'foo'`
| ReturnRemoval | `return $foo;` | -
| SharedCaseRemoval | `switch($a) { case 'a': case 'b': break; }` | `switch($a) { case 'b': break; }` `switch($a) { case 'a': break; }`

#### `ArrayItemRemoval`

Configuration options:

* `remove: first`: defines the way the mutator operates. Could be:
   - `first` - remove only first element from each array
   - `last` - remove only last element from each array
   - `all` - remove every element one by one from each array resulting in as many mutations as total number of items in arrays.
* `limit: PHP_INT_MAX`: when `remove = all` specifies maximum number of elements that will be removed form array. Only elements at the beginning will be mutated.

> When using `all` option we advise to set the limit as well

> You should remember to exclude files containing large arrays (like configuration)
> when using `ArrayItemRemoval` mutator in `all` mode

infection.json5:

```json
{
    "mutators": {
        "ArrayItemRemoval": {
            "settings": {
                "remove": "all",
                "limit": 15
            }
        }
     }
}
```

### Loop

| Name | Original | Mutated |
| :------: | :------: |:-------:|
| Break_ | break; | continue; |
| Continue_ | continue; | break; |
| Foreach_ | foreach ($someVar as ...); | foreach ([] as ...); |
| For_ | for ($i=0; $i < 10; $i++); | for ($i=0; false; $i++); |
| While_ | while ($condition); | while (false); |
| DoWhile | do {} while ($condition); | do {} while (false); |

### Sorting

| Name | Original | Mutated |
| :------: | :------: |:-------:|
| Spaceship | $a <=> $b | $b <=> $a |

### Nullify

|     Name     |      Original      | Mutated |
|:------------:|:------------------:|:-------:|
|  ArrayFind   |   `array_find()`   |  `null`   |
| ArrayFindKey | `array_find_key()` |  `null`   |

### Literal Numbers

| Name | Original | Mutated |
| :------: | :------: |:-------:|
| OneZeroFloat | 0.0 | 1.0 |
| OneZeroFloat | 1.0 | 0.0 |
| DecrementInteger | 7 | 6 |
| IncrementInteger | 7 | 8 |

### Exceptions

| Name | Original | Mutated |
| :------ | :------ |:------- |
| Throw_ | `throw new NotFoundException();` | `new NotFoundException();` |
| Finally_ | `try {} catch (\Exception $e) {} finally {}` | `try {} catch (\Exception $e) {}` |
| UnwrapFinally | `try { $callback(); } finally { $cleanUpCallbak(); }` | `$callback(); $cleanUpCallbak();` |

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
| :------ | :------ |:------- |
| PregQuote | `$a = preg_quote('text');` | `$a = 'text';` |
| PregMatchMatches | `preg_match('/pattern/', $value, $matches);` | `(int) $matches = array();` |
| PregMatchRemoveCaret | `preg_match('/^test/', $string);` | `preg_match('/test/', $string);` |
| PregMatchRemoveDollar | `preg_match('/test$/', $string);` | `preg_match('/test/', $string);` |
| PregMatchRemoveFlags | `preg_match('/test$/iu', $string);` | `preg_match('/test$/u', $string);`, `preg_match('/test$/i', $string);` |

### Extensions

#### `BCMath`

|   Name   | Original | Mutated |
| :------ | :------ |:------- |
| BCMath   | `bcadd($a, $b, $mod);` | `(string) ($a + $b);` |
|          | `bcdiv($a, $b, $mod);` | `(string) ($a / $b);` |
|          | `bcmod($a, $b, $mod);` | `(string) ($a % $b);` |
|          | `bcmul($a, $b, $mod);` | `(string) ($a * $b);` |
|          | `bcpow($a, $b, $mod);` | `(string) ($a ** $b);` |
|          | `bcsub($a, $b, $mod);` | `(string) ($a - $b);` |
|          | `bcsqrt($a, $mod);` | `(string) \sqrt($a);` |
|          | `bcpowmod($a, $b, $c, $mod);` | `(string) (\pow($a, $b) % $c);` |
|          | `bccomp($a, $b, $mod);` | `$a <=> $b;` |

 * `"bcpowmod": true`: You are able to disable any of the supported bcmath functions. All supported functions are enabled by default.

infection.json5:

```json
{
    "mutators": {
        "BCMath": {
            "settings": {
                "bcpowmod": false,
                "bccomp": false
            }
        }
     }
}
```

#### `MBString`

|   Name   | Original | Mutated |
| :------ | :------ |:------- |
| MBString | `mb_chr($code);` | `chr($code);` |
|          | `mb_ord($character);` | `ord($character);` |
|          | `mb_parse_str('text', $results);` | `parse_str('text', $results);` |
|          | `mb_send_mail($to, $subject, $message, $headers, $parameters);` | `mail($to, $subject, $message, $headers, $parameters);` |
|          | `mb_strcut('text', 0, 123, 'utf-8');` | `substr('text', 0, 123);` |
|          | `mb_stripos('text', 't', 0, 'utf-8');` | `stripos('text', 't', 0);` |
|          | `mb_stristr('text', 't', true, 'utf-8');` | `stristr('text', 't', true);` |
|          | `mb_strlen('text', 'utf-8');` | `strlen('text');` |
|          | `mb_strpos('text', 't', 0, 'utf-8');` | `strpos('text', 't', 0);` |
|          | `mb_strrchr('text', 't', true, 'utf-8');` | `strrchr('text', 't', true);` |
|          | `mb_strripos('text', 't', 0, 'utf-8');` | `strripos('text', 't', 0);` |
|          | `mb_strrpos('text', 't', 0, 'utf-8');` | `strrpos('text', 't', 0);` |
|          | `mb_strstr('text', 't', true, 'utf-8');` | `strstr('text', 't', true);` |
|          | `mb_strtolower('text', 'utf-8');` | `strtolower('text');` |
|          | `mb_strtoupper('text', 'utf-8');` | `strtoupper('text');` |
|          | `mb_substr_count('text', 't', 'utf-8');` | `substr_count('text', 't');` |
|          | `mb_substr('text', 0, 123, 'utf-8');` | `substr('text', 0, 123);` |
|          | `mb_str_split('text', 2, 'utf-8');` | `str_split('text', 2);` |
|          | `mb_convert_case('text', $mode);` | `strtoupper('text');`, `strtolower('text');` or `ucwords('text');` depending on mode |

 * `"mb_parse_str": true`: You are able to disable any of the supported mb string functions. All supported functions are enabled by default.

> Some of the functions are not supported due to complexity to convert them to standard string manipulation functions.
> Implementing them either does not make sense or creates too many false positive mutations.
> Not supported functions are `mb_ereg*`, `mb_split`, `mb_strrichr`, `mb_get_info` and similar.

infection.json5:

```json
{
    "mutators": {
        "MBString": {
            "settings": {
                "mb_send_mail": false,
                "mb_substr_count": false
            }
        }
     }
}
```

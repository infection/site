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

The Unwrap* mutator family will unwrap function parameter.

| Name     | Original | Mutated |
| :------: | :------: |:-------:|
| UnwrapArrayFilter | `$a = array_filter(['A', 1, 'C'], 'is_int');` | `$a = ['A', 1, 'C'];` |
| UnwrapArrayMap | `$a = array_map('strtolower', ['A', 'B', 'C']);` | `$a = ['A', 'B', 'C'];` |

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

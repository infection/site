---
title: Mutators
type: guide
order: 5
---

Infection supports a set of Mutators which are based on AST and PHP-Parser project.

### Binary Arithmetic

| Original | Mutated | Original | Mutated |
| :------: |:-------:| :------: |:-------:| 
| + | - | /= | *= |
| - | + | %= | *= |
| * | / | **= | /= |
| / | * | & | &#124; |
| % | * | &#124; | & |
| ** | / | ^ | & |
| += | -= | ~ |  |
| -= | += | >> | << |
| *= | /= | << | >> |

### Boolean Substitution

This temporarily encompasses logical mutators.

| Original | Mutated |
| :------: |:-------:| 
| true | false |
| false | true |
| && | &#124;&#124; |
| &#124;&#124; | && |
| and | or |
| or | and |
| ! | &nbsp; |

### Conditional Boundaries

| Original | Mutated
| :------: |:-------:
| >        | >= |
| <        | <= |
| >=       | > |
| <=       | < |

### Negated Conditionals

| Original | Mutated | Original | Mutated |
| :------: |:-------:| :------: |:-------:| 
| == | != | > | <= |
| != | == | < | >= |
| <> | == | >= | < |
| === | !== | <= | > |
| !== | === | &nbsp; | &nbsp; |

### Increments

| Original | Mutated |
| :------: |:-------:| 
| ++ | \-\- |
| \-\- | ++ |

### Return Values:

| Original | Mutated | Original | Mutated |
| :------: |:-------:| :------: |:-------:|
| return true; | return false; | return `(Any Float)`; | return `-(Any Float)`; |
| return false; | return true; | return $this; | return null; |
| return 0; | return 1; | return function(); | function(); return null; |
| return `(Any Integer)`; | return `-(Any Integer)`; | return new Class(); | new Class(); return null; |
| return 0.0; | return 1.0; | return 1.0; | return 0.0; |

### Literal Numbers

| Original | Mutated |
| :------: |:-------:| 
| 0 | 1 |
| 1 | 0 |
| 0.0 | 1.0 |
| 1.0 | 0.0 |

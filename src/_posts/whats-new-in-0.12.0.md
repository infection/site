layout: post
title: What's new in Infection 0.12.0
date: 2019-01-24 23:23:39
type: '{{type}}'
---

Release: https://github.com/infection/infection/releases/tag/0.12.0

## BC Breaks

`TrueValue` mutator does not mutate the 3rd parameter `true` in the following functions anymore:

* `in_array`
* `array_search`


## New features and enhancements

### Settings for Mutators

We've added an ability to configure Mutators in `infection.json` file. For example, `TrueValue` Mutator can be explicitly enabled for `in_array` and `array_search` functions:

```js
{
    "mutators": {
        "TrueValue": {
            "settings": {
                "in_array": true,     // default is `false`
                "array_search": true  // default is `false`
            }
        }
     }
}
```

### `symfony/phpunit-bridge` support

Previously, Infection didn't recognize `simple-phpunit` executable, failing with an error. Now it works as expected when bridge is used separately or as part of `symfony/flex` installation.

### Logging

Running command with `--only-covered` now logs only covered code mutations, making it easier to analyze results.

## New Mutators

### `array_splice`

This mutator takes the first argument of `array_splice()` function and assigns it to the variable, removing the function call.

```diff
- $a = array_splice(['A', 'B', 'C'], 1);
+ $a = ['A', 'B', 'C'];
```

### `array_slice`

```diff
- $a = array_slice(['A', 'B', 'C'], 1);
+ $a = ['A', 'B', 'C'];
```

### `array_change_key_case`

```diff
- $a = array_change_key_case(['foo' => 'bar']);
+ $a = ['foo' => 'bar];
```

### `array_column`

```diff
- $a = array_column([['foo' => 'bar]], 'foo');
+ $a = [['foo' => 'bar]];
```

### `array_diff_key`

```diff
- $a = array_diff_key(['foo' => 'bar'], ['baz' => 'bar]);
+ $a = ['foo' => 'bar];
```

### `array_diff_ukey`

```diff
- $a = array_diff_ukey(['foo' => 'bar'], ['baz' => 'bar], $callable);
+ $a = ['foo' => 'bar];
```

### `array_diff_assoc`

```diff
- $a = array_diff_assoc(['foo' => 'bar'], ['baz' => 'bar]);
+ $a = ['foo' => 'bar];
```

### `array_diff_uassoc`

```diff
- $a = array_diff_assoc(['foo' => 'bar'], ['baz' => 'bar], $callback);
+ $a = ['foo' => 'bar];
```

### `array_intersect_ukey`

```diff
- $a = array_intersect_ukey(['foo' => 'bar'], ['bar' => 'baz']);
+ $a = ['foo' => 'bar'];
```

### `array_intersect_key`

```diff
- $a = array_intersect_key(['foo' => 'bar'], ['bar' => 'baz']);
+ $a = ['foo' => 'bar'];
```

### `array_intersect_uassoc`

```diff
- $a = array_intersect_uassoc(['foo' => 'bar'], ['bar' => 'baz']);
+ $a = ['foo' => 'bar'];
```

### `array_merge_recursive`

```diff
- $a = array_merge_recursive(['A', 'B', 'C'], ['D']);
+ $a = ['A', 'B', 'C'];
```

### `array_udiff_assoc`

```diff
- $a = array_udiff_assoc(['foo' => 'bar'], ['baz' => 'bar], $callback);
+ $a = ['foo' => 'bar'];
```


------

Enjoy!

<a class="github-button" href="https://github.com/infection/infection" data-icon="octicon-star" data-show-count="true" aria-label="Star infection/infection on GitHub">Star</a>
<script async defer src="https://buttons.github.io/buttons.js"></script>

layout: post
title: What's new in Infection 0.9.0
date: 2018-07-01 00:40:12
type: '{{type}}'
---

Release: https://github.com/infection/infection/releases/tag/0.9.0

## BC Breaks

Before upgrading, make sure you know about backward incompatible changes.

* `--log-verbosity` values `1`, `2`, `3` have been deprecated. Use `debug`, `default`, `none` respectively. Read more [here](/guide/command-line-options.html#log-verbosity).

## New features and enhancements

### Profiles

One of the most wanted feature! [It allows you](http://localhost:4000/guide/profiles.html) to configure what mutators to use or skip, by one or by "profiles". This idea about Profiles is pretty much the same as in [PHP-CS-Fixer](http://cs.sensiolabs.org/) (`@PSR2`, `@symfony`, etc.).

How does it work? The following configuration will use the `@default` profile, but turn off the `@function_signature` profile.
On top of that, it does not apply the `TrueValue` mutator on any classes that match the provided ignore patterns. In particular, `TrueValue` mutator does not mutate the code inside `Full\NameSpaced\Class` class and inside `create()` method of all `SourceClass` classes.

These ignores can also be added to profiles, to ensure infection is as flexible as you need it.

All profiles are prepended by an `@` and in snake case, while all mutators are in PascalCase.

``` json infection.json
{
    ...
    "mutators": {
        "@default": true,
        "@function_signature": false,
        "TrueValue": {
            "ignore": [
                "NameSpace\\*\\SourceClass::create",
                "Full\\NameSpaced\\Class"
            ]
        }
    }
}
```

> [See](/guide/profiles.html#The-Profiles) how Mutators are grouped in Profiles

### Prefixed PHAR

Starting from Infection `0.9.0`, we will be shipping a prefixed PHAR by [PHP-Scoper](https://github.com/humbug/php-scoper). What does it mean?

In a nutshell, PHP-Scoper adds a random prefix to each class' namespace in the bundled code. It means that if you have PHP-Parser `3` in your project, but `infection.phar` has PHP-Parser `4` - there won't be any conflicts anymore.

Now you can **safely** use PHAR distribution instead of requiring Infection by `Composer`.

### Badge logger

[![Infection MSI](https://badge.stryker-mutator.io/github.com/infection/infection/master)](https://infection.github.io)

Thanks to our friends from [Stryker](https://stryker-mutator.io/) - mutation testing framework for Javascript - Infection now has a [Mutation Badge](http://localhost:4000/guide/mutation-badge.html)!

Add it to your project to show how awesome your are! [Run mutation logger](http://localhost:4000/guide/mutation-badge.html) on CI (e.g. Travis) to update the badge automatically.

### Per-Mutator logger

New `perMutator` logger [can be configured](http://localhost:4000/guide/usage.html) in `infection.json` config. It shows a detailed report about Mutator effectiveness in a `Markdown` syntax.

Example:

| Mutator | Mutations | Killed | Escaped | Errors | MSI | Covered MSI |
| ------- | --------- | ------ | ------- |------- | --- | ----------- |
| ArrayItem | 19 | 12 | 7 | 0 | 63| 63 |
| AssignmentEqual | 4 | 3 | 1 | 0 | 75| 75|
| ... | ... | ... | ... | ... | ...| ... |
| TrueValue | 51 | 29 | 15 | 0 | 57| 66|

### Ignore MSI violations with zero mutations

If your project is quite big, mutation testing can take too much time to run it for each build on CI. In this case, it's possible to run Infection [just for the changed files](https://blog.alejandrocelaya.com/2018/02/17/mutation-testing-with-infection-in-big-php-projects/). 

Imagine, you want to have at least 80% `MSI` and you run Infection as

``` bash
./infection.phar [...] --min-msi=80
```

When someone pushes the code that is not analyzed by Infection, e.g. new `json` file, Infection will create `0` Mutants and the MSI will be `0`, so the build will fail.

To avoid this situations, there is a new option `--ignore-msi-with-no-mutations` just for that.

### New Mutators

#### `Finally_`

This mutator removes `finally {}` block from your `try / catch / finally` chain. Goal: to understand whether finally blocks are tested and bring any value.

By the way, did you know [it is possible](https://3v4l.org/Hse6E) to not have any of the `catch` blocks in PHP? ;)

``` php
try {
    var_dump('try');
} finally {
    var_dump('finally');
}

// string(3) "try"
// string(7) "finally"
```

#### `PregQuote`

This mutator replaces `$a = preg_quote('text');` with `$a = 'text';`. Goal: to test whether `preg_quote` call is useful.

#### Set of `Type Cast` Mutators

These mutators remove type casting (e.g. `$count = (int) $request->get(...)` -> `$count = $request->get(...)`) in order to check whether this casting is useless or not.

#### `ArrayItem`

This mutator does the following:

``` diff
- [$a->foo => $b->bar]
+ [$a->foo > $b->bar]
```

It applies only for keys and values that have side effects (read *explicit or implicit function calls*). 

Firstly, this mutation changes the keys of the array, which is a good thing to check your tests. Secondly, it changes values, but without removing function/method calls. So if you are just asserting on method calls of your Mock objects and do not test keys/values - mutation won't be killed!

#### `Yield_`

``` diff
- yield $a => $b;
+ yield $a > $b;
```

The goal is clear again - the key and the value of the returned value are changed, it must be caught by your test.

#### `Assignment`

It replaces all variants of `+=`, `*=`, `.=`, etc. with just `=`.

``` diff
- $dql .= 'GROUP BY status';
+ $dql = 'GROUP BY status';
```

#### `For_`

This mutator do the following:

``` diff
- for ($i = 0; $i < 10; $i++) {...}
+ for ($i = 0; false; $i++) {...}
```

### Miscellaneous

We have also replaced our custom logic of disabling Xdebug with the new `composer` tool: `composer/xdebug-handler`. Check out [this great library](https://github.com/composer/xdebug-handler)!

It can automatically restart any process with disabled Xdebug in order to achieve the best performance.

-------

If you use and/or like Infection, please make sure to give us a star:
<a class="github-button" href="https://github.com/infection/infection" data-icon="octicon-star" data-show-count="true" aria-label="Star infection/infection on GitHub">Star</a>

Also, you can follow us on Twitter: [https://twitter.com/infection_php](https://twitter.com/infection_php)

-------

Thank you `@infection/core` and all contributors for `0.9.0` release. This is a great day for Mutation Testing in PHP.

Enjoy!

<script async defer src="https://buttons.github.io/buttons.js"></script>
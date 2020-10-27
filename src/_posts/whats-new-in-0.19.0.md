layout: post
title: What's new in Infection 0.19.0
date: 2020-10-28 02:21:13
type: '{{type}}'
---

Release: https://github.com/infection/infection/releases/tag/0.19.0

## New features and enhancements

### PHP versions support

Infection now requires PHP 7.4+ and works on PHP 8.0 branch 🎉.

### Compatibility with PHPUnit 9.3+

[There were significant changes in PHPUnit 9.3](https://github.com/sebastianbergmann/phpunit/blob/a0d6b21c6c8f6564212a1a14292d230ee35eba6d/ChangeLog-9.3.md#configuration-of-code-coverage-and-logging-in-phpunitxml) regarding XML configuration file which caused issue for Infection.

Now, Infection should be compatible with any PHPUnit version, correctly working with the old and new `phpunit.xml` schemas.

## New Mutators

### `YieldValue` mutator

Removes a key and leaves only a value of `yield` statement:

```diff
- yield $a => $b;
+ yield $b;
```

------

Enjoy!

<a class="github-button" href="https://github.com/infection/infection" data-icon="octicon-star" data-show-count="true" aria-label="Star infection/infection on GitHub">Star</a>
<script async defer src="https://buttons.github.io/buttons.js"></script>

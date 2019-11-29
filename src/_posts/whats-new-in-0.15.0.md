layout: post
title: What's new in Infection 0.15.0
date: 2019-09-29 10:13:26
type: '{{type}}'
---

Release: https://github.com/infection/infection/releases/tag/0.15.0

## BC Breaks

We changed a path for `JUnit` report expected by Infection when existing coverage is provided.

Before:

`build/coverage/phpunit.junit.xml`

After:

`build/coverage/junit.xml`

## New features and enhancements

### Codeception Test Framework Support

![Codeception](/images/posts/0-15-0/codeception.png)

We are happy to announce Codeception + Infection integration, one of the most upvoted feature request.

Let's bring a new level of tests quality for Codeception users!

### Log mutation results directly to `stdout`/`stderr`

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">The next version of Infection will have an ability to log mutation results directly to stdout/stderr, which is useful for CI. Thank you <a href="https://twitter.com/duncan3dc?ref_src=twsrc%5Etfw">@duncan3dc</a> <a href="https://t.co/Mc21KInMy2">pic.twitter.com/Mc21KInMy2</a></p>&mdash; Infection PHP (@infection_php) <a href="https://twitter.com/infection_php/status/1194333902158082048?ref_src=twsrc%5Etfw">November 12, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

### PHP `7.4` compatibility

Infection is now fully compatible with PHP 7.4.

### New Symfony versions compatibility

Infection is now fully compatible with Symfony 4.4 and Symfony 5.0.

### Allow to enable `pcov` with `--initial-tests-php-options`

Now, you van enable `pcov` for Initial Tests run in Infection to generate coverage:

```bash
$ infection --initial-tests-php-options='-d extension=pcov.so'
```

See [/guide/command-line-options.html#initial-tests-php-options](/guide/command-line-options.html#initial-tests-php-options)

### Version number under ASCII banner

Little, but useful enhancement: we've added a version number right under Infection ASCII banner (like Composer does it):

```bash
$ infection --threads=4

    ____      ____          __  _
   /  _/___  / __/__  _____/ /_(_)___  ____
   / // __ \/ /_/ _ \/ ___/ __/ / __ \/ __ \
 _/ // / / / __/  __/ /__/ /_/ / /_/ / / / /
/___/_/ /_/_/  \___/\___/\__/_/\____/_/ /_/

Infection - PHP Mutation Testing Framework 0.15.0@b96e312cb6726862089f63cbc6557b62fe29f4c0

...
```

## New Mutators

### `clone` removal

```diff
$now = new \DateTime();
- $cloned = clone $now;
+ $cloned = $now;

$cloned->modify('+1 day');
```

This mutator helps to find unnecessary or untested cloning.

### `UnwrapStrReplace`

This mutator takes the third argument of `str_replace()` function and assigns it to the variable.

```diff
- $a = str_replace('Afternoon', 'Evening' ,'Good Afternoon!');
+ $a = 'Good Afternoon!';
```

------

Enjoy!

<a class="github-button" href="https://github.com/infection/infection" data-icon="octicon-star" data-show-count="true" aria-label="Star infection/infection on GitHub">Star</a>
<script async defer src="https://buttons.github.io/buttons.js"></script>

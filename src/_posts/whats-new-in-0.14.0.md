layout: post
title: What's new in Infection 0.14.0
date: 2019-09-20 12:50:13
type: '{{type}}'
---

Release: https://github.com/infection/infection/releases/tag/0.14.0

Infection now requires PHP 7.2.9+. If you can't for some reason upgrade, don't worry, you can still use previous versions.

Most of the work in `0.14.0` was done to improve stability, performance and DX. However, there are a couple of new features and enhancements.

### Performance and memory consumption

We [made an update](https://github.com/infection/infection/pull/710) to dramatically reduce memory usage by using classes instead of object-like arrays. For example, running Infection for Psalm now takes 58% less memory (`5G` instead of `12G`).

> Read [this blog post](https://steemit.com/php/@crell/php-use-associative-arrays-basically-never) to understand why you should prefer classes.

### Precision in metrics calculator

You can now use whatever precision you want in `--min-msi` and `--covered-min-msi` options without rounding.

Example:

> The minimum required MSI percentage should be 71.43%, but actual is 71.428571428571%. Improve your tests!

## New Mutators

Infection already mutates some of the new operators from PHP 7.4, and we a couple of new mutators for this new syntax.

### Spread Operator in Array Expression

RFC: https://wiki.php.net/rfc/spread_operator_for_array

```diff
- $array = [...$collection, 4];
+ $array = [[...$collection][0], 4];
```

Basically, it removes all elements from `$collection` except the first one to ensure your code uses everything from the `$collection` and spread operator is really needed here.

### Leave one element in array

```diff
- return $collection;
+ return \count($collection) > 1 ? array_slice($collection, 0, 1, true) : $collection;
```

It is similar to the previous one, but works without spread operator. It leaves only one element in the returned array.


### Unwrap `mb_str_split`

RFC: https://wiki.php.net/rfc/mb_str_split

In `0.13.0`, we've added a new mutator that converts `mb_*` functions to usual ones. PHP 7.4 adds new function - `mb_str_split` which will be also mutated to `str_split`.

## Removed functionality

### Remove the `self-update` command

We have removed self-update command and recommend using [PHIVE](https://phar.io/).

```bash
phive install infection
```

When you want to upgrade infection, run

```bash
phive update infection
```

## Developer Experience (DX)

### `infection.json` schema validation

Starting from `0.14.0`, all mutators are validated by [our JSON schema](https://github.com/infection/infection/blob/master/resources/schema.json). No more incorrect configuration.

### `xdebug-filter`

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Did you know you can significantly speed up code coverage collecting by using xdebug-filter?<br><br>With this simple diff, our PHPUnit run is now 30% faster (from 6 to 4 minutes).<br><br>Read the blog post by <a href="https://twitter.com/s_bergmann?ref_src=twsrc%5Etfw">@s_bergmann</a> and <a href="https://twitter.com/belanur?ref_src=twsrc%5Etfw">@belanur</a> that explains it in details <a href="https://t.co/4PWeQrEdIQ">https://t.co/4PWeQrEdIQ</a> <a href="https://t.co/8ny2ojLaJT">pic.twitter.com/8ny2ojLaJT</a></p>&mdash; Infection PHP (@infection_php) <a href="https://twitter.com/infection_php/status/1171519807167926272?ref_src=twsrc%5Etfw">September 10, 2019</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script> 

Our builds are faster now which is a good thing when providing PRs and developing Infection locally.

We recommend you read the mentioned blog post and apply the same approach for your project, or use `pcov` for collecting code coverage data.

## Internals

### Rework Infection command

We have reworked the main entry point of Infection application - `InfectionCommand` class.

This is how the mutation testing algorithm looks like:

![before](/images/posts/0-14-0/infection-algorithm.png)

And this is how `InfectionCommand` now looks like:

```php
protected function execute(InputInterface $input, OutputInterface $output)
{
    $adapter = $this->startUp();

    $this->runInitialTestSuite($adapter);
    $this->runMutationTesting($adapter);
    
    if (!$this->checkMetrics()) {
        return 1;
    }
    
    return 0;
}
```

This should help new contributors with understanding the processes inside Infection.

> All other enhancements and bugfixes are listed in the changelog: https://github.com/infection/infection/blob/0.14/CHANGELOG.md

-----

## Next steps

### Codeception

We are working really hard to integrate Codeception into Infection. There were major blocker issues and we had to patch Codeception as well to fix them. We really hope to complete the work by `0.15.0` release in the next couple of months.

### Split Infection to separate packages

Currently, Infection is a quite a big project with all the code placed inside one repository. We will definitely split it to several ones.

1. First of all, we want to extract all Mutators to a separate package. Read the explanation here https://github.com/infection/infection/issues/669
2. We need to extract Test Framework adapters to separate packages because now it's not convenient to maintain the code, set package requirements for test framework adapters and update the code (e.g. we can't say that Infection requires `codeception/codeception: ^3.1.1` because not all the users will use Codeception, so it must be a separate package)

Have another great idea? Let us know! 

------

Enjoy!

<a class="github-button" href="https://github.com/infection/infection" data-icon="octicon-star" data-show-count="true" aria-label="Star infection/infection on GitHub">Star</a>
<script async defer src="https://buttons.github.io/buttons.js"></script>

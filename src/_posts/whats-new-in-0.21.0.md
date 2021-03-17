layout: post
title: What's new in Infection 0.21.0
date: 2021-01-27 10:11:19
type: '{{type}}'
---

Release: https://github.com/infection/infection/releases/tag/0.21.0

## BC Breaks

* Removed `OneZeroInteger` mutator in favor of `IncrementInteger`/`DecrementInteger` mutators
* Renamed `@zero_iteration` profile to the `@loop`

## GitHub Sponsors ♥️

Finally, we've added an ability to support us on GitHub Sponsors.

We help thousands of projects and teams to write more reliable software by improving their test suites. If you like Infection, consider supporting us on GitHub Sponsors: https://github.com/sponsors/infection

Thanks to [all of you](/guide/github-sponsors.html#Our-awesome-Sponsors) who are already sponsoring us!


## New features and enhancements

### `@infection-ignore-all` annotation

Give this example Infection won't mutate or even look at anything inside this function:

```php
/** @infection-ignore-all */
public function doSomethingNastyButCostlyToRefactor() {

}
```

Likewise, given this annotation Infection won't consider anything in this loop:

```php
/** @infection-ignore-all */
foreach ($foo as $bar) {
    // 
}
```

This can be useful when you want to disable all the mutators for a particular piece of the code.

> There are many other ways of disabling mutators & profiles: see [here](/guide/how-to.html#How-to-disable-Mutators-and-profiles)

### New `infection describe` command

Run the `infection describe` command to get information about mutators, right from the command line.

```diff
infection describe Plus

Mutator Category: orthogonalReplacement

Description:
Replaces an addition operator (`+`) with a subtraction operator (`-`).

For example:

- $a = $b + $c;
+ $a = $b - $c;
```

For some mutators, there will be pieces of advice on how to kill Mutants. Feel free to share your cases and contribute to this doc.

> See the full list of available mutators [here](/guide/mutators.html)

### `--noop` option for Noop mutators

There can be a situation when Infection kills the Mutant, but if you do the same changes in the source code manually, tests pass.

Infection runs the tests **in a random order**, and if the project's tests suite is not ready for it, tests can fail because of reordering. Make sure to always run tests randomly:

```xml phpunit.xml
<phpunit executionOrder="random">
    <!--  ...  -->
</phpunit>
```

Another possible reason is that tests are not ready to be executed in parallel, when you use Infection with a `--threads=X` parameter.

Examples:

* tests read and write to the same database
* tests read and write to the same filesystem

in both cases, one test can override the data written by another test so that one of them fails.

In order to debug such issues, there is a special `--noop` option for it. When it's used, all mutators leave the code untouched, but Infection still runs the tests in order to kill such Mutants.

If everything works as expected, every Mutant should be escaped. For every mutation (which in fact is not a mutation at all) tests should pass, because the source code is not changed.

This is an example of how the output can look like:

```bash
bin/infection --noop

Processing source code files: 407/407
.: killed, M: escaped, U: uncovered, E: fatal error, T: timed out, S: skipped

UMMMMMMMMMM                                          (11 / 11)

11 mutations were generated:
       0 mutants were killed
       1 mutants were not covered by tests
      10 covered mutants were not detected
       0 errors were encountered
       0 time outs were encountered
       0 mutants required more time than configured

Metrics:
         Mutation Score Indicator (MSI): 0%
         Mutation Code Coverage: 90%
         Covered Code MSI: 0%
```

so, Mutants are either not covered by tests or escaped. It means tests are green for each noop mutator that just don't change the code.

If, for some reason, some Mutants are killed with `--noop`, then there is an issue. To further debug the reason, `--log-verbosity=all` option can be used to analyze `infection.log` file. Don't forget to enable [`text` logger](/guide/usage.html#Configuration-settings) in `infection.json` configuration file:

```json
{
    "logs": {
        "text": "infection.log"
    }
}
```

In this log file, you can see tests output for every Mutant, with the information about why tests fail.

## New Mutators

### `PregMatchRemoveFlags` mutator

This mutator removes all flags used in a regular expression in `preg_match()` function, one by one.

```diff
- preg_match('/^test$/igu', $string);

# Mutation 1
+ preg_match('/^test$/gu', $string);
# Mutation 2
+ preg_match('/^test$/iu', $string);
# Mutation 3
+ preg_match('/^test$/ig', $string);
```

### `PregMatchRemoveCaret` mutator

Removes `^` symbol from a regular expression:

```diff
- preg_match("/^test$/", $string));
+ preg_match("/test$/", $string));
```

### `PregMatchRemoveDollar` mutator

Removes `$` symbol from a regular expression:

```diff
- preg_match("/^test$/", $string));
+ preg_match("/^test/", $string));
```

There will be much more mutators for a regular expression. Our core team member **@BackAndTea** is working on [Regexer](https://github.com/BackEndTea/Regexer) - parser for building AST for regexes.
This will allow working with them in a much easier way and do more complex mutations.

### PHP 8 `NullSafe` mutators

#### `NullSafeMethodCall` mutator

```diff
- $object->getObject()?->getName();
+ $object->getObject()->getName();
```

#### `NullSafePropertyCall` mutator

```diff
- $object->property?->name;
+ $object->property->name;
```

### `Concat` mutator

Swaps different sides of `concatenation` operator:

```diff
- $result = $foo . $bar;
+ $result = $bar . $foo;
```

### `ConcatOperandRemoval` mutator

Swaps different sides of `concatenation` operator:

```diff
- $result = $foo . $bar;
# Mutation 1
+ $result = $bar;
# Mutation 2
+ $result = $foo;
```

### `While` mutator

This mutator turns while into 0 iteration cycle:

```diff
$condition = true;
- while ($condition) {
+ while (false) {
```

### `DoWhile` mutator

This mutator turns do/while into 1 iteration cycle:

```diff
do {
    $condition = true;
- } while ($condition);
+ } while (false);
```

------

Enjoy!

<a class="github-button" href="https://github.com/infection/infection" data-icon="octicon-star" data-show-count="true" aria-label="Star infection/infection on GitHub">Star</a>
<script async defer src="https://buttons.github.io/buttons.js"></script>

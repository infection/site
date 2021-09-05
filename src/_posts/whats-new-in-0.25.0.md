layout: post
title: What's new in Infection 0.25.0
date: 2021-09-06 10:13:32
type: '{{type}}'
---

Release: https://github.com/infection/infection/releases/tag/0.25.0

### Speed up Infection runs by remembering which test killed a mutant

When Infection runs Mutation Analysis for the first time, we can save the information about which Mutant was killed by which test, and then on the subsequent Infection executions (second and farther), we can use this cached knowledge and run those tests that killed particular Mutants first.

This will benefit all Infection users, especially those who use Infection with slow functional tests where the difference between running 1 or 2 tests can be in seconds.

Here is an example for the real project, showing the difference between the very first and the second Infection runs for one particular Mutant:

[![infectionCache](/images/posts/0-25-0/infection-cache.png)](/images/posts/0-25-0/infection-cache.png)

You can notice that on the first Infection run, we had to run 489 tests in order to kill `PublicVisibility` Mutant and it took 38 seconds (!), because functional tests are quite slow.

On the same time, on the second Infection run, we got the previously saved information and executed failed test first (that test that was 489th on the first run), and we killed Mutant by 0.5s.

Running this new feature for one branch on the real project with slow functional test, we got the following result:

```diff
- Time: 1m 49s. Memory: 0.07GB (first run)
+ Time: 38s. Memory: 0.07GB (second run)
```

### Generate coverage for filtered files only when `--filter` or `--git-diff-filter` are used

Collecting coverage data is very expensive operation.

In previous versions, when Infection ran your test suite, it did it with `--coverage-xml` and `--log-junit` report, because Infection needs this data to know by whats tests particular line of the source code is covered, and how fast the tests are.

Imagine, you have 1000 tests that takes 1m to be executed. When you run them with coverage, 1m can become 2, 3 or even more minutes, because **collecting code coverage data costs a lot**.

More and more people start using Infection for changed files only (this can greatly decrease the time needed for Mutation Analysis), and collecting coverage data for **all** the files is useless when you are mutating only 2 files from thousands.

When the `--filter` option is used in Infection, we 100% know that we will mutate only particular files, so we need the code coverage only for them.

Starting from `0.25.0`, the next command line

```
infection --filter=src/path/to/File1.php,src/path/to/File2.php
```

creates the following `phpunit.xml` for initial tests under the hood:

```xml
<phpunit>
    <coverage>
        <include>
            <file>src/path/to/File1.php/</file>
            <file>src/path/to/File2.php/</file>
        </include>
    </coverage>
</phpunit>
```

This will dramatically decrease the time needed for collecting coverage data since we reduce the number of processed files.

> We recommend using `pcov` to collect coverage, not `Xdebug` or `phpdbg`

#### Some numbers

Tests with the whole`src` **folder** in `coverage.include`:

```bash
............................................                  2423 / 2423 (100%)

Time: 03:11.112, Memory: 587.62 MB

OK (2423 tests, 9861 assertions)
Generating code coverage report ... done [00:12.564]
```


Tests with 5 **files** in `coverage.include`:

```bash
............................................                  2423 / 2423 (100%)

Time: 01:12.771, Memory: 34.00 MB

OK (2423 tests, 9861 assertions)
Generating code coverage report ... done [00:00.041]
```

Difference:

```diff
- Time: 03:11.112, Memory: 587.62 MB
+ Time: 01:12.771, Memory: 34.00 MB
```

So, it saves 2 from 3 minutes.

Another case is with Infection and `--filter` option used for the real project.

```diff
infection -j4 --only-covered --filter=src/Recorder/RecorderCapabilities.php --ignore-msi-with-no-mutations --show-mutations  --log-verbosity=all --only-covering-test-cases

- Time: 8s. Memory: 28.00MB (0.24.0)
+ Time: 2s. Memory: 26.00MB (0.25.0)
```

it is `4x` faster for the filtered file set.

Notes: this feature will benefit those developers, who use Infection with `--filter` or `--git-diff-filter` options, running MT for the changed/added files.



### JSON schema inside `infection.json`

Infection will now add `$schema` property to generated `infection.json` file. This will allow IDEs to **autocomplete** all the settings available for usage.

If you already use Infection, please do the following:

1. Rename `infection.json.dist` to `infection.json` if applicable
2. Add `$schema` to your `infection.json` file:
  if you installed Infection via `Composer`:
  ```json
  {
      "$schema": "vendor/infection/infection/resources/schema.json"  
  }
  ```

  or if you downloaded PHAR distribution:
  ```json
  {
      "$schema": "https://raw.githubusercontent.com/infection/infection/0.25.0/resources/schema.json"  
  }
  ```

###  Detect syntax errors during mutation analysis

Infection will now detect syntax errors produced by Mutation Operators. Chances that it will happen with built-in mutators are quite low, because we are linting the mutated source code in Infection tests.

But since in the future we will allow users to add their own mutators, it's better to track syntax errors and do not treat such cases as Killed Mutants.

Example of the logs generated for syntax error:

```
Syntax Errors mutants:
======================

1) /infection/tests/e2e/Syntax_Error_PHPUnit/src/SourceClass.php:14    [M] SyntaxError

--- Original
+++ New
@@ @@
     }
     public function bar() : string
     {
-        return $this->foo();
+        return $->foo();
     }
 }

  PHPUnit 9.5.8 by Sebastian Bergmann and contributors.
  
  Warning:       Your XML configuration validates against a deprecated schema.
  Suggestion:    Migrate your XML configuration using "--migrate-configuration"!
  
  E                                                                   1 / 1 (100%)
  
  Time: 00:00.005, Memory: 6.00 MB
  
  There was 1 error:
  
  1) Syntax_Error_PHPUnit\Test\SourceClassTest::test_hello
  ParseError: syntax error, unexpected token "->", expecting variable or "{" or "$"
  
  /infection/tests/e2e/Syntax_Error_PHPUnit/src/SourceClass.php:13
  /infection/tests/e2e/Syntax_Error_PHPUnit/tests/SourceClassTest.php:12
```

Among these new features, [there were several bug fixes and internal improvement](https://github.com/infection/infection/compare/0.24.0...0.25.0) so please upgrade.

------

Enjoying Infection? Consider supporting us on GitHub Sponsors ♥️

https://github.com/sponsors/infection

<a class="github-button" href="https://github.com/infection/infection" data-icon="octicon-star" data-show-count="true" aria-label="Star infection/infection on GitHub">Star</a>
<script async defer src="https://buttons.github.io/buttons.js"></script>

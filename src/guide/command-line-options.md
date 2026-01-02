---
title: Command Line Options
type: guide
order: 40
---

Besides general Symfony Console application command line options, Infection has its own ones.

### `--filter`

If you're only interested in mutating a subset of your files, you can pass a `--filter` option containing:

- a relative file path:
``` bash
infection --filter=src/Service/Mailer.php
```

- a filename:
``` bash
infection --filter=Mailer.php
```

- a relative directory path:
``` bash
infection --filter=src/Service/
```

- a comma separated list of relative paths:
``` bash
infection --filter=src/Service/Mailer.php,src/Entity/Foobar.php
```
- a comma separated list of filenames:
``` bash
infection --filter=Mailer.php,Foobar.php
```

This in no way restricts the initial Infection check on the overall test suite, which is still executed in full to ensure all tests are passing correctly before proceeding.

<p class="tip">You can check the result of the filter applied by using `infection config:list-sources --filter=<filter>`.</p>

### `--threads` or `-j`

If you want to run tests for mutated code in parallel, set this to something > 1. It will **dramatically speed up** mutation process. Please note that if your tests somehow depends on each other or use database, this option can lead to failing tests which give many false-positives results.

To automatically detect the number of CPU cores, use `--threads=max`.

For Infection versions below `0.26.15`, you can detect the number of CPU cores depending on OS:

``` bash
# on Linux
infection -j$(nproc)

# on OSX
infection -j$(sysctl -n hw.ncpu)
```

> Running Infection with more threads does not necessarily lead to better performance. Consider benchmarking several numbers to find one that works best for your particular case.

### `--test-framework`

This is a name of the Test Framework to use. Currently, Infection supports `PHPUnit`, `PhpSpec` and `Codeception`.

If you are using `infection/infection` Composer package, `PHPUnit` is installed by default. Other test framework adapters will be automatically installed on demand.
[PHAR distribution](/guide/installation.html#Phar) is bundled with all available adapters.

>Feel free to request a new test framework to be supported out of the box in GitHub's issues.

### `--test-framework-options`

This option allows passing additional options to the test framework. Example for `PHPUnit`:

```bash
infection.phar --test-framework-options="--verbose --filter=just/unit/tests"
```

This will execute the `PHPUnit` as:

```bash
phpunit [...infection options] --verbose --filter=just/unit/tests
```

> Please note that if you choose to use `--configuration`, `--filter`, or `--testsuite` for `PHPUnit`, these options will only be applied to the _initial_ test run. Each mutation has a custom `phpunit.xml` file generated for it which defines a single testsuite containing the tests which should be executed for that mutation. Applying `--filter` or `--testsuite` would not make sense in this context as the tests have already been filtered down. 

### `--coverage`

Path to the existing coverage reports.

When you use Continuous Integration for your project, probably you are already generating code coverage metrics and run `PHPUnit` with `Xdebug`/`phpdbg` enabled. Then, you run Infection for mutation testing, which in its turn, generates Code Coverage again for internal needs. This dramatically increases the build time because running your tests with debugger *twice* requires too much time.

With this option it's possible to reuse already generated coverage in Infection.

For `PHPUnit` and `Codeception`:

* Infection requires both the`xml` and `junit` reports to work
* If `build/coverage` path is provided, it should contain `coverage-xml` folder and `junit.xml` file
  * `build/coverage/coverage-xml/*`
  * `build/coverage/junit.xml`

For `PhpSpec`:

* Infection requires the `xml` report to work
* If `build/coverage` path is provided, it should contain `phpspec-coverage-xml` folder

Example:

```bash
# collect coverage
vendor/bin/phpunit --coverage-xml=build/coverage/coverage-xml --log-junit=build/coverage/junit.xml

# use coverage
infection.phar --coverage=build/coverage
```

### `--git-diff-filter`

Allows filtering files to mutate by using `git diff` with `--diff-filter` option. Sensible values are: `AM` - added and modified files. `A` - only added files.

Best to be used during pull request builds on CI, e.g. with GitHub Actions, Travis CI and so on.

Usage:

```bash
# this is needed on GitHub Actions to fetch the base branch to make a diff
git fetch --depth=1 origin $GITHUB_BASE_REF

infection.phar --git-diff-filter=A
```

This command will mutate only those files that were added in the Pull Request. The diff is done between the current branch and a common ancestor of it and the base branch. If there is no common ancestor available, perhaps because your CI server used a shallow checkout, or you have unrelated branches, infection will use a direct diff between branches as a fallback.

> It's possible to configure the base branch, see [`--git-diff-base`](/guide/command-line-options.html#git-diff-base) option

> It's possible to mutate only touched **lines**, see  [`--git-diff-lines`](/guide/command-line-options.html#git-diff-lines) option

<p class="tip">You can check the result of the filter applied by using `infection config:list-sources` and/or debug the
git values used by using the infection git commands. They can be listed with `infection list git`.</p>

### `--git-diff-base`

Supposed to be used only with [`--git-diff-filter`](/guide/command-line-options.html#git-diff-filter) option. Configures the base branch for `git diff` command.

Usage:

```bash
# this is needed on GitHub Actions to fetch the base branch to make a diff
git fetch --depth=1 origin $GITHUB_BASE_REF

infection.phar --git-diff-base=origin/$GITHUB_BASE_REF --git-diff-filter=AM
```

<p class="tip">You can check the result of the filter applied by using `infection config:list-sources` and/or debug the
git values used by using the infection git commands. They can be listed with `infection list git`.</p>

### `--git-diff-lines`

Allows mutating only touched **lines** of code. Under the hood, this option mutates only added and changed files, comparing your current branch with `master` branch by default.

Base branch can be changed by using `--git-diff-base=main` option. In this case, your current branch will be compared with `main` branch.

Useful to check how your changes impacts MSI in a feature branch. Useful for those who do not want / can't write tests for the whole touched legacy file, but wants to cover their own changes (only modified lines).

Can significantly improve performance since fewer Mutants are generated in comparison to using `--git-diff-filter=AM` or mutating all files.

<p class="tip">You can check the result of the filter applied by using `infection config:list-sources` and/or debug the
git values used by using the infection git commands. They can be listed with `infection list git`.</p>

### `--map-source-class-to-test`

> Meant to be used together with `--git-diff-lines` / `--git-diff-filter` / `--filter`

This option can dramatically decrease the time needed for "Initial Tests Run" stage. 

If project has `N` tests files and we run Infection with, for example, `infection --git-diff-lines` and only 1 file `Foo.php` is updated/added in a Pull Request - it doesn't make sense to run all the `N` tests to generate code coverage if we know that only 1 file of `N` covers the source code file - `FooTest.php`.

In practice, `PHPUnit` even has different methods that help define which test file covers which class:

- [`requireCoverageMetadata`](https://docs.phpunit.de/en/11.0/configuration.html#the-requirecoveragemetadata-attribute) configuration attribute
- [`#[CoversClass(...)]`](https://docs.phpunit.de/en/11.0/attributes.html#code-coverage) attribute

In the example above, Infection would run only `FooTest.php` to generate coverage for `Foo.php`.

Without this option, Infection will attempt to run *all* the project's tests, as it doesn't know which tests cover `Foo.php`.

Currently, `--map-source-class-to-test` supports the only one strategy of mapping source class to test file: by adding `*Test` postfix to a file name. If source class is named `Foo`, Infection will try to run `FooTest`.

Under the hood, it builds a regex for `--filter` option: `--filter='FooTest|BarTest'`.

### `--id`

<span class="version-since">Available in Infection 0.30.0+</span>

Run only one Mutant by its ID. Can be used multiple times. If source code is changed, this value can be invalidated. Pass all previous options with this one.

Example of usage: you completed a feature and wrote tests, then you run

```shell
infection --git-diff-lines
```

to get all mutations for the new and changed lines. But if there are too many mutations, it can be more convenient to focus on just 1 mutant at a time.

Imagine you want to work on this Mutant:

```diff
11) src/SourceClass.php:9    [M] Minus [ID] 6fa7eadad5b9fd1a72e4d80c83a61cc3

@@ @@
 {
-    public function hello(): string
+    protected function hello(): string
     {
         return 'hello';
     }
 }
```

So you copy `6fa7eadad5b9fd1a72e4d80c83a61cc3` value and run the same command as previously, just adding `--id=6fa7eadad5b9fd1a72e4d80c83a61cc3`:

```shell
infection --git-diff-lines --id=6fa7eadad5b9fd1a72e4d80c83a61cc3
```

With this, Infection will only produce one mutant, and you can update your tests and re-run this command to check if it's killed or still not.

### `--logger-github`

Supposed to be used only with GitHub Actions. This logger prints GitHub Annotation warnings for escaped Mutants right in the Pull Request.

Use `--logger-github=true` to force-enable or `--logger-github=false` to force-disable it.

<p class="tip">Note that the GitHub Actions environment is automatically detected and this switch isn't actually necessary when executed there.</p>

![GitHub Annotation Escaped Mutant](/images/github-logger.png)

Usage:

```bash
# this is needed on GitHub Actions to fetch the base branch to make a diff
git fetch --depth=1 origin $GITHUB_BASE_REF

infection.phar --logger-github --git-diff-filter=A
```

Here is [a real example](https://github.com/infection/infection/blob/bef65fc22faa200edd367ffe12596905947a2a93/.github/workflows/mt-annotations.yaml#L50-L52) how Infection uses it itself.

> Note: Infection automatically detects `GITHUB_WORKSPACE` environment variable for report linking.

### `--logger-gitlab`

This option is used to provide a path to the generated GitLab (Code Climate) Code Quality Report:

```bash
infection.phar --logger-gitlab='gitlab-coverage.json'
```
After Infection completes its job, the `gitlab-coverage.json` file will be generated. This file can than be included as a `codequality` report artifact.

Takes precedence over `logger.gitlab` setting inside `infection.json5` file. If you want to always generate the GitLab Coverage report it's better to configure it inside `infection.json5`, see [here](/guide/usage.html).

> See [this sample repository](https://gitlab.com/maks-rafalko/infection-gitlab-integration-example/-/blob/e9248aecc694ce822ea5c79654e115c8044fadf3/.gitlab-ci.yml#L18-27) as an example of how to configure Code Quality with Infection 

This is how it works on PR main page:

![GitHub Annotation Escaped Mutant](/images/gitlab-logger-pr-view.png)

This is how it works on diff view:

![GitHub Annotation Escaped Mutant](/images/gitlab-logger-diff-view.png)

> Note that "See findings in merge request diff view" is [not available](https://docs.gitlab.com/ee/ci/testing/code_quality.html#features-per-tier) on free tier

> Note: Infection automatically detects `CI_PROJECT_DIR` environment variable for report linking.

### `--logger-project-root-directory`

While generating GitHub and GitLab reports, Infection need to replace some links to their correct path according to your
repository. To do so, it will auto-detect `GITHUB_WORKSPACE` GitHub environment variable, and `CI_PROJECT_DIR` GitLab
environment variable as project root directory.

If this auto-detection does not fit your needs (for instance, while using custom Docker image and custom project path in
GitLab CI), you can customize the path to replace using `--logger-project-root-directory` option:

```bash
infection.phar --logger-project-root-directory='/custom/project/root/directory/path'
```

> Note: if `GITHUB_WORKSPACE` and `CI_PROJECT_DIR` cannot be detected, and `--logger-project-root-directory` option is
> not set, Infection will try to retrieve the project root directory using `git rev-parse --show-toplevel`.

### `--logger-html`

This option is used to provide a path to the generated HTML Report:

```bash
infection.phar --logger-html='mutation-report.html'
```

After Infection completes its job, the `mutation-report.html` file will be generated with HTML report ([example](/static/html-report-example.html)).

Takes precedence over `logger.html` setting inside `infection.json5` file. If you want to always generate HTML report, it's better to configure it inside `infection.json5`, see [here](/guide/usage.html).

> If you want to store HTML report in the cloud (useful for OSS projects), see [Stryker Dashboard](/guide/mutation-badge.html) integration

### `--logger-text`

This option is used to provide a path to the generated text report:

```bash
infection.phar --logger-text='mutation-report.log'
```

After Infection completes its job, the `mutation-report.log` file will be generated with human-readable text report.

Takes precedence over `logger.text` setting inside `infection.json5` file. If you want to always generate text report, it's better to configure it inside `infection.json5`, see [here](/guide/usage.html).

> The option supports `php://stdout` value which can, for instance, be useful in a CI environment.

### `--skip-initial-tests`

If you have already run the test suite to ensure it is passing, and you are providing coverage using `--coverage` then you can use this option to increase performance by not running the entire test suite again.

<p class="tip">Note that it is extremely important that you ensure the test suite is passing when using this option, otherwise test failures would appear like caught mutations and those mutations may be reported incorrectly.</p>

### `--only-covered`

Run the mutation testing only for covered by tests files.

> This option was removed in Infection 0.31.0, use `--with-uncovered` instead

### `--only-covering-test-cases`

Execute only those test cases that cover mutated line, not the whole test file with covering test cases. Can dramatically speed up Mutation Testing for slow test suites, like functional or integration. 

For `PHPUnit` it uses `--filter` option under the hood. This option is not applicable for other test frameworks.

> Read more about the problem and solution in [this blog post](/2021/07/27/whats-new-in-0.24.0/#Major-performance-improvement-for-projects-with-slow-test-suites)

### `--with-uncovered`

<span class="version-since">Available in Infection 0.31.0+</span>

Allow mutation of code not covered by tests.

### `--show-mutations` or `-s`

Limits how many colorized diffs of mutated files are shown to the console. 20 mutated diffs are shown by default.

```bash
infection --show-mutations=0 # don't show any diffs
infection --show-mutations=50 # will show 50 mutated diffs
infection --show-mutations=max # will show all mutated diffs
```

> Please note that all mutations can be logged to files as well, if enabled. See `logs` in [usage](./usage.html) section.

### `--configuration` or `-c`

If you want to use custom configuration file path or name, use this option for it.

### `--min-msi`

This is a minimum threshold of Mutation Score Indicator (MSI) in percentage. Can be used with CI server to automatically control tests quality.

> Read more about [using Infection in CI server](./using-with-ci.html)

### `--min-covered-msi`

This is a minimum threshold of Covered Code Mutation Score Indicator (MSI) in percentage. Can be used with CI server to automatically control tests quality.

### `--mutators`

This is a comma separated option to specify a particular set of mutators or [profiles](/guide/profiles.html) that need to be executed. Example:

``` bash
infection --mutators=PublicVisibility,Plus,Decrement,@number
```

> See [here](./mutators.html) to find all mutator names.

### `--no-progress`

This option has two effects:
- It disables intermediate buffering of mutations used to count them. This causes progress bars to not have a total number of mutations displayed, while also reducing memory usage and speeding up the entire process. It is beneficial during CI, and for larger projects.
- It disables dynamic progress bars output to reduce the amount of generated text output.

Disabling progress bars removes the following lines from output on Continuous Integration servers:

```bash
Processing source code files: 0/5678
Processing source code files: 1/5678
Processing source code files: 2/5678
Processing source code files: 3/5678
...
5k lines of text
...
Processing source code files: 5678/5678

```

Progress bar display will be automatically disabled with or without this option when either `CI` or `CONTINUOUS_INTEGRATION` environment variables are set to `"true"`.

For example, there is no need to enable this option manually on Travis CI just to hide progress bars.

### `--noop`

Use noop mutators that do not change the AST. 

All mutant processes run actual tests. It is expected that all Mutants are escaped, because the code is not changed.

For debugging purposes.

> Read about debugging issues with `--noop` option [here](/guide/debugging-issues.html)

> If you want to see applied mutations but not run tests, use `--dry-run` option. 

### `--dry-run`

Run Mutation Testing with applied mutations but without actually running the tests for each Mutant.

All mutant processes returns `0` exit code. It is expected that all Mutants are escaped.

Can be useful for:

- print all mutations that will be applied - when combined with `--show-mutations=max`
- debugging purposes

### `--force-progress`

Outputs progress bars and mutation count during progress even if a CI is detected.

This option also reverts optimizations made by `--no-progress` option, read [here](/guide/command-line-options.html#no-progress). 

### `--static-analysis-tool-options`

Specify additional options to pass to the static analysis tool (e.g. memory limit). 

Example: `--static-analysis-tool-options="--memory-limit=-1 --stop-on-error"`.

### `--formatter`

This is a name of console output formatter. Possible values are: `dot`, `progress`. Default is `dot` formatter.

### `--log-verbosity`

The verbosity of the log file, `all` - this mode will add "Killed mutants" into log file and add additional information, `default` - normal mode will skip "Killed mutants" section in the log file, `none` - which will disable logging to files.

``` bash
infection --log-verbosity=all
```

### `--initial-tests-php-options`

Run Initial Tests process with additional php options. For example with `-d zend_extension=xdebug.so` which will run `Xdebug` only for code coverage.
May be useful for cases when `Xdebug` is not enabled globally. Also it's useful from performance point of view.
``` bash
infection --initial-tests-php-options="-d zend_extension=xdebug.so"
```

### `--ignore-msi-with-no-mutations`

Ignore MSI violations when no mutations are generated. This will force Infection to return a zero exit code even when the required MSI is not reached.

### `--debug`

Run Infection in a debug mode. With this option Infection will not erase `tmpDir` and this might be useful to run particular unit test with a mutated code for example.

Also, this option will add test framework's output to log file so you can analyze by which test particular Mutant was killed, and additional information about executed command lines will be added.

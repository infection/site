---
title: Command Line Options
type: guide
order: 4
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

This in no way restricts the initial Infection check on the overall test suite which is still executed in full to ensure all tests are passing correctly before proceeding.


### `--threads` or `-j`

If you want to run tests for mutated code in parallel, set this to something > 1. It will **dramatically speed up** mutation process. Please note that if your tests somehow depends on each other or use database, this option can lead to failing tests which give many false-positives results.

On most platforms where GNU coreutils are available, which includes all variants of Linux, there is `nproc` command that returns the number of processors available. It can be used as such to let Infection run at the full speed:

``` bash
# on Linux
infection -j$(nproc)

# on OSX
infection -j$(sysctl -n hw.ncpu)
```

### `--test-framework`

This is a name of the Test framework to use. Currently Infection supports `PHPUnit`, `PhpSpec` and `Codeception`.

>Feel free to request a new test framework to be supported out of the box in Github's issues.

### `--test-framework-options`

This options allows to pass additional options to the test framework. Example for `PHPUnit`:

```bash
infection.phar --test-framework-options="--verbose --filter=just/unit/tests"
```

This will execute the phpunit as:

```bash
phpunit [...infection options] --verbose --filter=just/unit/tests
```

> Please note that if you choose to use `--filter` and `--testsuite` for PHPUnit, these options will only be applied to the _initial_ test run. Each mutation has a custom `phpunit.xml` file generated for it which defines a single testsuite containing the tests which should be executed for that mutation. Applying `--filter` or `--testsuite` would not make sense in this context as the tests have already been filtered down. 


### `--coverage`

Path to the existing coverage reports.

When you use Continuous Integration for your project, probably you are already generating code coverage metrics and run PHPUnit with `XDebug`/`phpdbg` enabled. Then, you run Infection for mutation testing, which in its turn, generates Code Coverage again for internal needs. This dramatically increases the build time because running your tests with debugger *twice* requires too much time.

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
vendor/bin/phpunit --coverage-xml=build/coverage/coverage-xml --log-junit=build/coverage/phpunit.junit.xml

# use coverage
infection.phar --coverage=build/coverage
```

### `--only-covered`

Run the mutation testing only for covered by tests files.

### `--show-mutations` or `-s`

Show colorized diffs of mutated files to the console.

> Please note that all mutations are logged to the `infection.log` file as well.

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

This option disables progress bars output. The main purpose is to use it on Continuous Integration servers to reduce the amount of generated text output, e.g.:

```bash
Creating mutated files and processes: 0/45678
Creating mutated files and processes: 1/45678
Creating mutated files and processes: 2/45678
Creating mutated files and processes: 3/45678
...
45k lines of text
...
Creating mutated files and processes: 45678/45678

```

Infection automatically enable this mode when either `CI` or `CONTINUOUS_INTEGRATION` environment variable are set to `"true"`.

For example, there is no need to enable it manually on Travis CI.


### `--formatter`

This is a name of console output formatter. Possible values are: `dot`, `progress`. Default is `dot` formatter.

### `--log-verbosity`

The verbosity of the log file, `all` - this mode will add "Killed mutants" into log file and add additional information, `default` - normal mode will skip "Killed mutants" section in the log file, `none` - which will disable logging to files.

``` bash
infection --log-verbosity=all
```

### `--initial-tests-php-options`

Run Initial Tests process with additional php options. For example with `-d zend_extension=xdebug.so` which will run Xebug only for code coverage.
May be useful for cases when Xebug is not enabled globally. Also it's useful from performance point of view.
``` bash
infection --initial-tests-php-options="-d zend_extension=xdebug.so"
```

### `--ignore-msi-with-no-mutations`

Ignore MSI violations when no mutations are generated. This will force Infection to return a zero exit code even when the required MSI is not reached.

### `--debug`

Run Infection in a debug mode. With this option Infection will not erase `tmpDir` and this might be useful to run particular unit test with a mutated code for example.

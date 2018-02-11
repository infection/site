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


### `--threads`

If you want to run tests for mutated code in parallel, set this to something > 1. It will **dramatically speed up** mutation process. Please note that if your tests somehow depends on each other or use database, this option can lead to failing tests which give many false-positives results. 

### `--test-framework`

This is a name of the Test framework to use. Currently Infection supports `PhpUnit` and `PhpSpec`.

>Feel free to request a new test framework to be supported out of the box in Github's issues.

### `--test-framework-options`

This options allows to pass additional options to the test framework. Example for PHPUnit:

```bash
infection.phar --test-framework-options="--verbose --filter=just/unit/tests"
```

This will execute the phpunit as:

```bash
phpunit [...infection options] --verbose --filter=just/unit/tets
```

> Please note that `--filter` options for PHPUnit is a special one, because we can add it to executable command only for _initial_ test run. For each mutation process, it can't be used because we already have filtered out list of executed tests which should not be overridden by this option.

### `--only-covered`

Run the mutation testing only for covered by tests files.

### `--show-mutations` or `-s`

Show colorized diffs of mutated files to the console.

> Please note that all mutations are logged to the `infection-log.txt` log file as well.

### `--configuration` or `-c`

If you want to use custom configuration file path or name, use this option for it.

### `--min-msi`

This is a minimum threshold of Mutation Score Indicator (MSI) in percentage. Can be used with CI server to automatically control tests quality.

> Read more about [using Infection in CI server](./using-with-ci.html)

### `--min-covered-msi`

This is a minimum threshold of Covered Code Mutation Score Indicator (MSI) in percentage. Can be used with CI server to automatically control tests quality.

### `--mutators`

This is a comma separated option to specify a particular set of mutators that need to be executed. Example:

``` bash
infection --mutators=PublicVisibility,Plus,Decrement
```

> See [here](./mutators.html) to find all mutator names.

### `--formatter`

This is a name of console output formatter. Possible values are: `dot`, `progress`. Default is `dot` formatter.

### `--log-verbosity`

The verbosity of the log file, `1` - debug mode (default) will add "Killed mutants" into log file and add additional information, `2` - normal mode will skip "Killed mutants" section in the log file.

``` bash
infection --log-verbosity=2
```

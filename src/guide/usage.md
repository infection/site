---
title: Usage
type: guide
order: 30
---

## Configuration

The first time you run Infection for your project, it will ask you several questions to create a config file `infection.json5`, with the following structure:

``` json
{
    "source": {
        "directories": [
            "src"
        ],
        "excludes": [
            "Config",
            "Folder/with/File.php",
            "/\\.interface\\.php/",
            "{Infrastructure/.*}"
        ]
    },
    "timeout": 10,
    "threads": "max",
    "logs": {
        "text": "infection.log",
        "html": "infection.html",
        "summary": "summary.log",
        "json": "infection-log.json",
        "perMutator": "per-mutator.md",
        "github": true,
        "gitlab": "gitlab-code-quality.json",
        "stryker": {
            "badge": "/^release-.*$/"
        },
        "summaryJson": "summary.json"
    },
    "tmpDir": "/opt/tmp-folder",
    "phpUnit": {
        "configDir": "app",
        "customPath": "\/path\/to\/phpunit-6.1.phar"
    },
    "mutators": {
        "global-ignore": [
            "FooClass::__construct"
        ],
        "global-ignoreSourceCodeByRegex": [
            "Assert::.*"
        ],
        "@default": true,
        "@function_signature": false,
        "TrueValue": {
            "ignore": [
                "NameSpace\\*\\Class::method"
            ],
            "ignoreSourceCodeByRegex": [
                "\\$this->logger.*"
            ]
        }
    },
    "testFramework":"phpunit",
    "testFrameworkOptions": "--filter=Unit",
    "staticAnalysisTool":"phpstan",
    "bootstrap":"./infection-bootstrap.php",
    "initialTestsPhpOptions": "-d zend_extension=xdebug.so"
}
```

If you want to override settings locally, create and commit to VCS `infection.json5.dist` but locally use `infection.json5` which should be ignored (e.g. in `.gitignore`).

> By default, Infection uses [`json5`](https://json5.org/) format for configuration file. It allows using comments, ES5-like keys and many more. But if you for some reason can't use it, Infection also supports `json` format. 

### Configuration settings

* `source` section:
  * `directories` - array, contains all folders with source code you want to mutate. Can be `.`, but make sure to exclude `vendor` in this case.
  * `excludes` - array, contains all folders or files you want to exclude within your source folders. It accepts full paths, as well as regular expressions, enclosed [by any delimiter accepted by PHP](https://www.php.net/manual/en/regexp.reference.delimiters.php). It accepts glob pattern too. However, its usage is discouraged, as it does not work exactly the same in all OS.
    Infection automatically excludes `vendor`, `test`, `tests` folders if the source folder is `.` (current dir). Make sure to not mutate your test suite.
    Paths under `excludes` key are relative to the `source.directories` folders.
    Here are some examples of `excludes`, assuming that `src` is defined in `source.directories`:
    * `"excludes": ["Config"]` skips the folder `src/Config`.
    * `"excludes": ["Folder/with/File.php"]` skips the file `src/Folder/with/File.php`.
    * `"excludes": ["/\\.interface\\.php/"]` skips all files containing `.interface.php` in the name.
    * `"excludes": ["{Infrastructure/.*}"]` skips all files within `src/Infrastructure` folder. Note that braces (`{}`) is a valid regex delimiter in PHP.
    * `"excludes": ["{.*/Infrastructure/.*}"]` skips all files within the `Infrastructure` path of the second level of directories within `src`. Therefore, `src/Shared/Infrastructure` or `src/SomeBoundedContext/Infrastructure` would be excluded, whereas `src/Shared/Domain` or `src/SomeBoundedContext/Application` would not.
* `timeout` - the maximum allowed time for mutated processes to run, in whole seconds, before they are considered a timeout. Make sure to set it to higher value than your tests are executed in seconds to avoid false-positives.
* `threads` - the number of threads to use by the runner when executing the mutations. Use "max" to auto calculate it.
* `logs`
  * `text` - human-readable text log file. Must see to understand what is going on during mutation process.
  * `html` - human-readable report, similar to PHPUnit HTML report. Based on [Stryker Elements](https://stryker-mutator.io/blog/one-mutation-testing-html-report/). Here is [an example](/static/html-report-example.html) for Infection itself. If you want to store HTML report in the cloud (useful for OSS projects), see [Stryker Dashboard](/guide/mutation-badge.html) integration.
  * `summary` - summary log file, which will only display the amount of mutants per category, (Killed, Errored, Escaped, Timed Out, [Skipped](/2020/08/18/whats-new-in-0.17.0/#Skip-S-mutations-that-are-over-specified-time-limit), and Not Covered)
  * `json` - machine-readable file in JSON format. Can be programmatically analyzed. In addition to general stats, contains original, mutated code, diff and test framework output for each Mutant.
  * `perMutator` - a markdown file which will give a break-down of the effectiveness of each mutator.  
  Each of the above logs accept a local filename to write to (eg `infection.log`), or you can write to the terminal using `php://stdout` or `php://stderr`, this can be useful in CI to store the mutation results in the output.
  * `github` - prints GitHub Annotation warnings right in the Pull Request. Supposed to be used with GitHub Actions. See [`--logger-github`](/guide/command-line-options.html#logger-github), but usually not necessary as it is automatically detected.
  * `gitlab` - GitLab (Code Climate) code quality report. Can be processed as a `codequality` report artifact in Gitlab.
  * `summaryJson` - machine-readable file in JSON format like `json` but containing only general stats. Can be programmatically analyzed, for example on CI.
* `tmpDir` - Optional. It's a folder where Infection creates its configs, caches and other stuff. It may be useful for people who doesn't have access to the default system temporary folder and/or doesn't have write permissions. Either absolute `/tmp/folder` or relative `var/cache` paths can be used.
* `phpUnit` - optional key
  * `configDir` - custom directory path with `phpunit.xml.dist` file. This is useful for example for old Symfony app, where `phpunit.xml.dist` is located at `./app`
  * `customPath` - custom path to PHPUnit executable. This is useful when you run tests by external shared phar file that is located outside project root.
* `ignoreMsiWithNoMutations` - optional key, whether to ignore MSI violations with zero mutations
* `minMsi` - optional key, a value for the Minimum Mutation Score Indicator (MSI) percentage value
* `minCoveredMsi` - optional key, a value for the Minimum Covered Code Mutation Score Indicator (MSI) percentage value
* `mutators`: optional key, it contains the settings for different mutations and profiles, read more about it [here](/guide/profiles.html)
* `testFramework`: optional key, it sets the framework to use for testing. Defaults to `phpunit`. This gets overridden by the `--test-framework` command line argument.
* `testFrameworkOptions`: optional key, specify additional options to pass to the test framework (IE: Enabling Verbose Mode). `--test-framework-options` will override this option.
* `staticAnalysisTool`: optional key, it sets the Static Analysis tool to use to catch escaped Mutants
* `bootstrap`: optional key, use it to specify a file to include as part of the startup to pre-configure the Infection environment. Useful for adding custom autoloaders not included in composer.
* `initialTestsPhpOptions`: optional key, specify additional php options for the initial test (IE: Enabling X-Debug). `--initial-tests-php-options` will override this option.

#### How to use custom autoloader or bootstrap file

If you have a custom autoloader or bootstrap file for your application, you should tell Infection about it.

For example, you have

```php
// custom-autoloader.php

require 'NonPsr4CompliantFile.php';
```

then you have to add it to the `infection.json5` file:

```json
{
    "bootstrap": "./custom-autoloader.php"
}
```

Thus, Infection will know how to autoload `NonPsr4CompliantFile` class. Without adding it to the config, Infection will not be able to create Mutations because internally it uses `new \ReflectionClass()` objects.

## Running Infection

Ensure that your tests are all in a passing state (incomplete and skipped tests are allowed). Infection will quit if any of your tests are failing.

If you have installed Infection as a global composer package, just run it in your project's root:

``` bash
infection
```

or if you cloned it to some folder:

``` bash
# cd /path/to/project/root

~/infection/bin/infection
```

### Running with `Xdebug`

In order to run Infection with Xdebug, you have several options:

#### Enable Xdebug globally

In this case just run

```bash
./infection.phar --threads=4
```

#### Enable Xdebug per process

Since Infection needs Xdebug *only* to generate code coverage in a separate process, it is possible to enable debugger just there. 

Assuming Xdebug is disabled globally, run

```bash
./infection.phar --initial-tests-php-options="-d zend_extension=xdebug.so"
```

### Running with `phpdbg`

In order to run Infection with `phpdbg` instead of Xdebug, you need to execute the following command:

```bash
phpdbg -qrr infection.phar
```

### Running without debugger

It is possible to run Infection without any debugger enabled. However, in this case you should provide already generated code coverage as an option

```bash
./infection.phar --coverage=path/to/coverage
```

> [Read more](./command-line-options.html#coverage) what types of coverage Infection requires and how to do it.

### `@infection-ignore-all` support

Infection supports `@infection-ignore-all` annotation on class, method, and statement level.

The following class will not be mutated even though it might have few covered lines.

```php
/**
 * @infection-ignore-all
 */
class Calculator
{
    public function add(float $a, float $b): float
    {
        return $a + $b;
    }
}
```
 
In this example, method `generate()` will be skipped from mutation logic, but `getDependencies()` will be mutated as usual method.
 
```php
class ProductFixture
{
    /**
     * @infection-ignore-all
     */
    public function generate(): void
    {
        // generate logic
    }
    
    public function getDependencies(): array
    {
        return [CategoryFixture::class];
    }
}
```

Likewise, given this annotation Infection won't consider anything in this loop:

```php
/** @infection-ignore-all */
foreach ($foo as $bar) {
    // 
}
```

## Exposed environment variables

Infection exposes a couple of environment variables:

* `INFECTION=1` this can be used in test environment to check whether the tests are executed from Infection or not.
* `TEST_TOKEN=<int>` for each process that Infection creates for running tests for particular Mutant, it adds `TEST_TOKEN=<int>` environment variable to be used for setting up connections to different databases. Read more [here](/guide/how-to.html#How-to-run-Infection-for-functional-tests).

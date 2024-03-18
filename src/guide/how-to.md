---
title: How-to Guides
type: guide
order: 9
---

## How to run Infection only for changed files

If you have thousands of files and too many tests, running Mutation Testing can take hours for your project. In this case, it's very convenient to run it only for the modified files.

Assuming you are on a feature branch, and the main branch is `master`, we can do it as the following:

### By using `--git-diff-filter` option

This option allows filtering files for mutation by using `git diff` under the hood.

If we want to mutate only `A`dded and `M`odified files, use:

```bash
infection --git-diff-filter=AM
```

> [Read more](/guide/command-line-options.html#git-diff-filter) about [`--git-diff-filter`](/guide/command-line-options.html#git-diff-filter)

### By using `--git-diff-lines` option

This allows mutating only touched **lines** of code.

Useful to check how your changes impacts MSI in a feature branch. Useful for those who do not want / can’t write tests for the whole touched legacy file, but wants to cover their own changes (only modified lines).

```bash
infection --git-diff-lines
```

> [Read more](/guide/command-line-options.html#git-diff-lines) about [`--git-diff-lines`](/guide/command-line-options.html#git-diff-lines)

### By using `--filter` option (for the old Infection versions)

```bash
CHANGED_FILES=$(git diff origin/master --diff-filter=AM --name-only | grep src/ | paste -sd "," -);
INFECTION_FILTER="--filter=${CHANGED_FILES} --ignore-msi-with-no-mutations";

infection --threads=4 $INFECTION_FILTER
```

The `--diff-filter=AM` returns only added and modified files, because we are not going to use removed ones.

The [`--ignore-msi-with-no-mutations` option](/guide/command-line-options.html#ignore-msi-with-no-mutations) tells Infection to not error on min MSI when we have `0` mutations.

#### Example for Travis CI:

```bash
jobs:
  include:
    - stage: Mutation Testing
    script:
      - |
        if [[ "${TRAVIS_PULL_REQUEST}" == "false" ]]; then
            INFECTION_FILTER="";
        else
            git remote set-branches --add origin $TRAVIS_BRANCH;
            git fetch;
            CHANGED_FILES=$(git diff origin/$TRAVIS_BRANCH --diff-filter=AM --name-only | grep src/ | paste -sd "," -);
            INFECTION_FILTER="--filter=${CHANGED_FILES} --ignore-msi-with-no-mutations";
            
            echo "CHANGED_FILES=$CHANGED_FILES";
        fi
        
        infection --threads=4 --log-verbosity=none $INFECTION_FILTER
```

For each job, Travis CI fetches only tested branch: 

```bash
git clone --depth=50 --branch=feature/branch
```
 
That's why we need to fetch `$TRAVIS_BRANCH` as well to make a `git diff` possible. Otherwise, you will get an error:

```bash
fatal: ambiguous argument 'origin/master': unknown revision or path not in the working tree.
```

## How to run Infection for functional tests

Imagine you have functional tests that do real SQL queries. Running such tests in parallel impossible without additional work, because 2 different concurrent processes will write to the same tables and conflict with each other.

To fix this issue, Infection provides `TEST_TOKEN=<int>` environment variable for each process that can be used to set up different connections to the databases.

If you have 3 parallel processes, they will use `db_1`, `db_2`, `db_3` correspondingly.

```bash
infection --threads=3
```

An example of how it can be done for Symfony project with Doctrine:

```yaml config/packages/test/doctrine.yaml
parameters:
    test_token: 1

doctrine:
    dbal:
        dbname: 'db_%env(default:test_token:TEST_TOKEN)%'
```

Or as a plain PHP code:

```php
$dbName = sprintf('db_%s', getenv('TEST_TOKEN'));
```

For this example to work, you will need to set up 3 database schemas.

## How to disable Mutators and profiles

### Disable Mutator

Mutators can be disabled in a config file - `infection.json5`. Let's say you don't want to mutate `+` to `-`. In order to disable this Mutator, the following config can be used: 

```json
{
    "mutators": {
        "@default": true,
        "Plus": false
    }
}
```

> The full list of Mutator names can be found [here](/guide/mutators.html).

In this example, we explicitly enable all Mutators from `@default` profile and disable `Plus` Mutator.

> Read about Profiles [here](/guide/profiles.html)

### Disable Profile

To disable all Mutators that work with Regular Expressions, we should disable the whole [`@regex` profile](/guide/profiles.html#regex):

```json
{
    "mutators": {
        "@default": true,
        "@regex": false
    }
}
```

### Disable in particular class or method or line

Sometimes you may want to disable Mutator or Profile just for one particular method or class. It's possible with `ignore` setting of Mutators and Profiles with the following syntax:

```json
{
    "mutators": {
        "@default": true,
        "@regex": {
            "ignore": [
                "App\\Controller\\User"
            ]
        },
        "Minus": {
            "ignore": [
                "App\\Controller\\User",
                "App\\Api\\Product::productList",
                "App\\Api\\Product::product::33"
            ]
        }
    }
}
```

Want to ignore the whole class? `App\Controller\User`

All classes in the namespace: `App\Api\*` 

All classes `Product` in any namespace: `App\*\Product`

Method of the class: `App\Api\Product::productList`

Method in all classes: `App\Api\*::productList`

Method by pattern: `App\Api\Product::pr?duc?List`

Line of the code: `App\Api\Product::product::33`


Internally, all patterns are passed to [`fnmatch()` PHP function](https://php.net/manual/en/function.fnmatch.php). Please read its documentation to better understand how it works.


### Do not mutate the source code matched by regular expression

You may want to exclude mutations to the code that, if mutated, has little-to-no impact, or, alternatively, sometimes isn't worth testing the result of - for example calls to a logging function. 

If your codebase has lots of logging, this can generate many unwanted mutants and will greatly slow down the mutation test run.

Consider these examples:

```diff
- $this->logger->error($message, /* context */ ['user' => $user]);
+ $this->logger->error($message, []);
```

```diff
- Assert::numeric($string);
```

To avoid them, you can ignore mutations by regular expression, matching the source code:

```json
{
    "mutators": {
        "global-ignoreSourceCodeByRegex": [
            "\\$this->logger.*"
        ]
    }
}
```

Or just per Mutator:

```json
{
    "mutators": {
        "MethodRemoval": {
            "ignoreSourceCodeByRegex": [
                "Assert::.*"
            ]
        }
    }
}
```

Exact matching:

```json
{
    "mutators": {
        "MethodRemoval": {
            "ignoreSourceCodeByRegex": [
                "Assert::numeric\\(\\$string\\);"
            ]
        }
    }
}
```

Ignore any mutants with particular method name, e.g.:

```diff
- public function methodCall() {
+ protected function methodCall() {
```

```diff
- $this->methodCall();
```

with the following config:

```json
{
    "mutators": {
        "global-ignoreSourceCodeByRegex": [
            ".*methodCall.*"
        ]
    }
}
```

<p class="tip">Do not add any delimiters (like `/`) to the regular expression: we are adding and escaping them for you.</p>

### Disable by `@infection-ignore-all` annotation

It's possible to disable all mutations by adding `@infection-ignore-all` annotation on class, method, and statement level.

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

See other examples [here](/guide/usage.html#infection-ignore-all-support).

## How to debug Infection

Sometimes you need to better understand what's going on during execution of Infection. 

* to use human-readable log file, use [`text`](/guide/usage.html) logger - in `infection.json5` add `logs.text` key
* information added to `text` log file is controlled by [`--log-verbosity`](/guide/command-line-options.html#log-verbosity)

When `--log-verbosity=all` is used, additionally _killed_ and _errored_ mutants will be added to the log file.

> The verbosity of the log file, `all` - this mode will add `“Killed mutants”` into log file and add additional information, `default` - normal mode will skip `“Killed mutants”` section in the log file, `none` - which will disable logging to files.

Use the following config file


```json infection.json5
{
    "logs": {"text": "infection.log"}
}
```

and execute Infection with

```bash
infection --log-verbosity=all
```

If you want to also log PHPUnit's output, as well as CLI commands that are executed internally by Infection, use [`--debug`](/guide/command-line-options.html#debug)

```bash
infection --log-verbosity=all --debug
```

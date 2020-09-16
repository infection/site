---
title: How-to Guides
type: guide
order: 9
---

## How to run Infection only for changed files

If you have thousands of files and too many tests, running Mutation Testing can take hours for your project. In this case, it's very convenient to run it only for the modified files.

Assuming you are on a feature branch, and the main branch is `master`, we can do it as the following:

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

## How to disable Mutators and profiles

### Disable Mutator

Mutators can be disabled in a config file - `infection.json.`. Let's say you don't want to mutate `+` to `-`. In order to disable this Mutator, the following config can be used: 

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

Ignore any mutants with particular method name

```diff
- public function methodCall() {
+ protected function methodCall() {
```

```diff
- $this->methodCall();
```

with the following config

```json
{
    "mutators": {
        "global-ignoreSourceCodeByRegex": [
            ".*methodCall.*"
        ]
    }
}
```

<p class="tip">Do not add delimiters (`/ /`) to a regular expression - they will be escaped.</p>

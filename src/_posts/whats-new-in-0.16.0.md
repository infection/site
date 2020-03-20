layout: post
title: What's new in Infection 0.16.0
date: 2020-03-29 11:03:56
type: '{{type}}'
---

Release: https://github.com/infection/infection/releases/tag/0.16.0

## BC Breaks

* Infection now requires PHP 7.3.12+. If you can't upgrade for some reason upgrade, don't worry, you can still use previous versions.
* We had [a bug](https://github.com/infection/infection/pull/1105) with the config file loading order. Instead of trying to load the file `infection.json` and if not found, try to load `infection.json.dist`, it was doing the reverse-order.

## Performance

### Allow the initial test suite to be skipped (`--skip-initial-test-suite`)

In order to speed up the whole mutation process, Infection first executes your test suite without any modification to ensure it passes. If code coverage is already provided, Infection will not attempt to generate it again from this test run.

However since many may already run the tests in another context, for example to retrieve a specific coverage format, requiring to run the test suite another time may be a slow and redundant step. For this reason, the `--skip-initial-test-suite` option has been added. Note that to be able to use this option, you **must** provide the code coverage with the `--coverage` option.

<p class="tip">Note that it is extremely important that you ensure the test suite is passing and the coverage used up to date. Otherwise some mutations might be incorrectly caught or a coverage-related error thrown in the middle of the mutation run.</p>

### Various performance improvements

TBD

* https://github.com/infection/infection/pull/1177
* https://github.com/infection/infection/pull/1172
* https://github.com/infection/infection/pull/1106
* https://github.com/infection/infection/pull/1082

## Splitting Infection by separate Packages

Infection has been split into different packages. For example, we have extracted `PhpSpec` and `Codeception` adapters out of the core.

You can read a very detailed explanation about why was it needed in [this RFC](https://github.com/infection/infection/issues/922).

In a nutshell, this is useful both for the end user and for maintainers:

* you will not download not needed code if you don't use those test frameworks when installing Infection as a Composer package which also allows to reduce the risk of package conflicts
* you will not need to upgrade Infection for patches or improvements made on the test framework adapters that you don't use
* now Test Frameworks have clear dependencies and requirements

Don't worry, if you are using Codeception or PhpSpec, these packages will be automatically installed at the first Infection execution after upgrading to 0.16.0.

List of new packages:

* [`infection/codeception-adapter`](https://github.com/infection/codeception-adapter)
* [`infection/phpspec-adapter`](https://github.com/infection/phpspec-adapter)
* [`infection/abstract-testframework-adapter`](https://github.com/infection/abstract-testframework-adapter) - interfaces for any testframework adapter
* [`infection/extension-installer`](https://github.com/infection/extension-installer) - autodiscovery of installed adapters. No need to add them to `infection.json`, just install a Composer package and you are done. Inspired by PHPStan and Psalm plugin system.
* [`infection/include-interceptor`](https://github.com/infection/include-interceptor) - Stream Wrapper. Allows to replace included (autoloaded) file with another one (magic that replaces your code with a mutated one) 


## Mutation Badge

We had this feature [before](/guide/mutation-badge.html), but it worked only for TravisCI.

Now, thanks to [`ondram/ci-detector`](https://github.com/OndraM/ci-detector), the mutation badge can be used for [CI servers supported by this library](https://github.com/OndraM/ci-detector#supported-continuous-integration-servers), including GitHub Actions, CircleCI, GitLab and so on.

Feel free to request an additional integration there if the list of currently supported continuous-integration servers does not contain a service you require.

> Read more about how to setup [Mutation Badge](/guide/mutation-badge.html)

## Global ignore feature for Mutators and Profiles

`global-ignore` allows to apply the `ignore` setting to all mutators and profiles registered. If `ignore` is specified for a given profile or mutator, it will be merged with `global-ignore`. 

For example, in the case below 


```json
{
    "mutators": {
        "@default": true,
        "global-ignore": [
            "FooClass::__construct"
        ],
        "TrueValue": {
            "ignore": [
                "NameSpace\\*\\SourceClass::create",
                "Full\\NameSpaced\\Class"
            ]
        }
    }
}
```

the final `ignore` setting for `TrueValue` will be:

```json
[
    "FooClass::__construct",
    "NameSpace\\*\\SourceClass::create",
    "Full\\NameSpaced\\Class"
]
```

## Notice to increase min MSI metrics

It's possible to [use Infection with CI server](/guide/using-with-ci.html), adding `--min-msi` and/or `--min-covered-msi` options, so when the actual results of these metrics are below the threshold, the build fails.

But, when you constantly improve the quality of your tests, MSI metric eventually increases its value (which is good), and now Infection will remind you to update the limits.

```bash
! [NOTE] The MSI is 2.5787422095418% percent points over the required MSI.     
!        Consider increasing the required MSI percentage the next time you run 
!        infection.    
```

## Codeception's Cest files support

It's now possible to use [Cest files](https://codeception.com/docs/07-AdvancedUsage#Cest-Classes) (Codeception Tests) with Infection. Due to how this type of tests work, it was not possible to generate a correct JUnit report for them.

Now they are fully supported



------

Enjoy!

<a class="github-button" href="https://github.com/infection/infection" data-icon="octicon-star" data-show-count="true" aria-label="Star infection/infection on GitHub">Star</a>
<script async defer src="https://buttons.github.io/buttons.js"></script>

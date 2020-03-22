layout: post
title: What's new in Infection 0.16.0
date: 2020-03-29 11:03:56
type: '{{type}}'
---

Release: https://github.com/infection/infection/releases/tag/0.16.0

## BC Breaks

* Infection now requires PHP 7.3.12+. If you can't upgrade for some reason upgrade, don't worry, you can still use previous versions.
* We had [a bug](https://github.com/infection/infection/pull/1105) with the config file loading order. Instead of trying to load the file `infection.json` and if not found, try to load `infection.json.dist`, it was doing this in a reverse order, stopping at `infection.json.dist`. If you have both `infection.json` and `infection.json.dist`, please note that the first will be used like it should, unlike before.

## Performance

### Allow the initial test suite to be skipped (`--skip-initial-test-suite`)

In order to speed up the whole mutation process, Infection first executes your test suite without any modification to ensure it passes. If code coverage is already provided, Infection will not attempt to generate it again from this test run.

However since many may already run the tests in another context, for example to retrieve a specific coverage format, requiring to run the test suite another time may be a slow and redundant step. For this reason, the `--skip-initial-test-suite` option has been added. Note that to be able to use this option, you **must** provide the code coverage with the `--coverage` option.

<p class="tip">Note that it is extremely important that you ensure the test suite is passing and the coverage used up to date. Otherwise some mutations might be incorrectly caught or a coverage-related error thrown in the middle of the mutation run.</p>

### Various performance improvements

In 0.15.x, the mutation process step flow was as follows:

- collect the source files configured
- parse each source files (to retrieve its AST)
- for each parsed file, traverse its AST to generate mutations
- for each mutation:
  - generate the difference of the modification in a human-friendly way
  - parse the associated code coverage to determine which tests should be executed for this mutation
  - sort the tests from fastest to slowest
  - dump the framework related configuration to be able to execute the associated tests in a separate process
  - create a process (not started yet) ready to be executed
- execute all the processes created above, in sequentially or in parallel depending of the configuration provided

While the above works fine on principle, there is a lot of rooms for improvements performance wise:

- Stream the whole process from collecting the source files to creating the mutation processes by leveraging PHP generators. The first benefit is when executing the processes in parallel, this allows to spend more time that was previously spent on "sleeping" when waiting between two polls on doing effective work. Another benefits is a better reactivity on the Infection run when the option `--no-progress` is used. Last but least, this allows to parse the coverage reports in smaller bits rather than requiring to load it entirely in-memory first. This is especially useful for big coverage reports which can easily be in the GBs.
- Leverage the code coverage report as the primary source for the source files to collect. While this does not affect the final results, it allows to check the non-covered files last, improving the feedback loop when running Infection with `--no-progress` combined with `--show-mutations`.
- Optimize the lookup and sorting of the tests. After creating a mutation, Infection looks up for which tests to execute for it and order those tests from fastest to slowest. Since this operation is done for each mutations, this is a very hot path in Infection, the sorting strategy has been adjusted and optimized for different cases in order to speed up that process.
- Previously we required a `MutantProcess` to record the results in order to log it in the different log files. This was an easy choice because this object could provide all the necessary informations. However in the case of mutations not executed by the tests, this translated in unnecessary operations (creating the process and dumping the framework adapter configuration). As a result we decoupled the logged results from `MutantProcess`, allowing to filter out those non-covered mutations earlier in the process while still being able to log them.

* https://github.com/infection/infection/pull/1177
* https://github.com/infection/infection/pull/1172
* https://github.com/infection/infection/pull/1106
* https://github.com/infection/infection/pull/1082

## Splitting Infection by separate Packages

As the support for more test frameworks is being added, a number of problem surfaced (you can read a more detailed explanation as of why in [this RFC](https://github.com/infection/infection/issues/922)). To palliate to this, we decided to split some parts of Infection such as the `PhpSpec` and `Codeception` test framework adapters info different packages.

You can read a very detailed explanation about why was it needed in [this RFC](https://github.com/infection/infection/issues/922).

In a nutshell, this is useful both for the end user and for maintainers:

* you will not download not needed code if you don't use those test frameworks when installing Infection as a Composer package which also allows to reduce the risk of package conflicts
* you will not need to upgrade Infection for patches or improvements made on the test framework adapters that you don't use
* Clearer test framework adapters dependencies and requirements

To ensure this change does not affect the user-experience of those using other test frameworks than PHPUnit, Infection will be able to automatically pick up that you are missing the test framework adapter package and propose you to install it for you.

List of new packages:

* [`infection/codeception-adapter`](https://github.com/infection/codeception-adapter)
* [`infection/phpspec-adapter`](https://github.com/infection/phpspec-adapter)
* [`infection/abstract-testframework-adapter`](https://github.com/infection/abstract-testframework-adapter) - interfaces for any testframework adapter
* [`infection/extension-installer`](https://github.com/infection/extension-installer) - autodiscovery of installed adapters. No need to add them to `infection.json`, just install a Composer package and you are done. Inspired by PHPStan and Psalm plugin system.
* [`infection/include-interceptor`](https://github.com/infection/include-interceptor) - Stream Wrapper. Allows to replace included (autoloaded) file with another one (magic that replaces your code with a mutated one) 


## Mutation Badge

It is possible to create a badge displaying your mutation score (check [here](/guide/mutation-badge.html) for more details), however this feature was limited to Travis CI only.

In 0.16.x, we switched to [`ondram/ci-detector`](https://github.com/OndraM/ci-detector) in order to expend the support of this feature to more CIs such as GitHub Actions, CircleCI, GitLab and others. The complete list can be found [here](https://github.com/OndraM/ci-detector#supported-continuous-integration-servers).

Now, thanks to [`ondram/ci-detector`](https://github.com/OndraM/ci-detector), the mutation badge can be used for [CI servers supported by this library](https://github.com/OndraM/ci-detector#supported-continuous-integration-servers), including GitHub Actions, CircleCI, GitLab and so on.

Feel free to request an additional integration there if the list of currently supported continuous-integration servers does not contain a service you require.

> Read more about how to setup [Mutation Badge](/guide/mutation-badge.html)

## Global ignore feature for Mutators and Profiles

Infection allows adding a configuration to ignore some parts of your code, [such as a class, a method or a specific line](/guide/how-to.html#How-to-disable-Mutators-and-profiles) for a given mutator. For example with:

```json
{
    "mutators": {
        "@default": true,
        "TrueValue": {
            "ignore": [
                "NameSpace\\*\\SourceClass::create",
                "Full\\NameSpaced\\Class"
            ]
        }
    }
}
```

You might however find yourself in the situation where you want to do this for all mutators. If you only have the `@default` profile enabled, this is a simple task. But if you have several mutators listed, you are out of luck and will find yourself having to do a very repetitive, error prone task which is also non-trivial to keep up to date.

In 0.16.x, we are introducing the `global-ignore` setting which allows to define an `ignore` setting which will be added to _all_ mutators. For example:

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

Will result in _all_ mutators referenced by `@default` to have the following `ignore` setting:

```json
["FooClass::__construct"]
```

And `TrueValue` will have:

```json
[
    "FooClass::__construct",
    "NameSpace\\*\\SourceClass::create",
    "Full\\NameSpaced\\Class"
]
```

## Notice to increase min MSI metrics

While this is not the recommended way`*`, it is possible to use the options `--min-msi` and/or `--min-covered-msi` options to force a certain threshold (the Infection process will exit with the error code `1` if one of those is not reached). When using Infection with those, Infection would also now display a recommendation to increase this threshold when the score is above the configured threshold:

```bash
! [NOTE] The MSI is 2.5787422095418% percent points over the required MSI.     
!        Consider increasing the required MSI percentage the next time you run 
!        infection.    
```

`*`: The MSI score is but a metric like another. The interesting part is not necessarily the score but which mutations escaped and whether or not those should be caught. Moreover if you are using Infection in an incremental way, i.e. running it only the changed files, this metric will drastically vary from a change to another depending of how testing this part is making it unsuitable for this use case.

## Codeception's Cest files support

It's now possible to use [Cest files](https://codeception.com/docs/07-AdvancedUsage#Cest-Classes) (Codeception Tests) with Infection. Due to how this type of tests work, it was not possible to generate a correct JUnit report for them.

Now they are fully supported



------

Enjoy!

<a class="github-button" href="https://github.com/infection/infection" data-icon="octicon-star" data-show-count="true" aria-label="Star infection/infection on GitHub">Star</a>
<script async defer src="https://buttons.github.io/buttons.js"></script>

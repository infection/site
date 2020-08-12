layout: post
title: What's new in Infection 0.17.0
date: 2020-08-04 23:42:11
type: '{{type}}'
---

Release: https://github.com/infection/infection/releases/tag/0.17.0

## BC Breaks

### `U` for uncovered

Previously, all uncovered by tests mutations were marked as `S` in the Infection's output. Now, `S` is for `Skipped`. `U` is for `Uncovered`. See below.

### Skip (`S`) mutations that are over specified time limit

[#1171](https://github.com/infection/infection/pull/1171) Exclude mutations that are over specified time limit.

In addition to code coverage reports, Infection collects execution time report, thus Infection can execute the fastest tests first. Consider that for a given line you may have several tests taking a certain amount of time, say, 20 seconds. If you happen to have a timeout of 15 seconds configured, earlier Infection would have tried to run these tests anyway, even if we can tell beforehand that they will result in a timeout, exhausting allotted time.

With this version, Infection would try to skip these over-time-budged mutations. This change considerably speeds up mutation testing for projects with incoherent test coverage, while still letting to reap the benefits of mutation testing where it is possible.

For example, if one has a 15-second long integration test, setting a time limit to 10 seconds will effectively exclude all mutations covered by the test. Now one has a choice of either raising the timeout or tagging this test with a `@coversNothing` annotation.


## Infection Playground

We are happy to introduce [Infection Playground](https://infection-php.dev/) 🎉🚀. 

This is Mutation Testing with `Infection` right in your browser!

You can write the code, write the tests, click `Run` and see Mutation Testing results.

Here are several reasons why we decided to create Infection Playground:

* spread mutation testing across more people
* make it unbelievable easy to try Mutation Testing in PHP - right in your browser. No projects to create locally, no need to install `Compoer`, `Infection`, `PHPUnit` - nothing. Just type a couple of lines of the source code, write a test and click `Run`.
* provide people a good tool to report issues for `Infection`. We hope it will be easier for developers to just create an example on https://infection-php.dev site and post a permanent link to GitHub's issue rather than creating standalone repository or even worse not giving an example at all
* real examples for the documentation, e.g. Mutators. These are for [PublicVisibility](https://infection-php.dev/r/qxk) and [ProtectedVisibility](https://infection-php.dev/r/j0l)

Try it. Share your results with colleagues. Experiment with it.

Quick reminder that most popular tools in PHP ecosystem have playgrounds as well:
                         
* PHPStan: https://phpstan.org/r/d650ce41-9691-40d3-b413-cadbe04e0163
* Psalm: https://psalm.dev/r/ed3124e0b3
* Rector: https://getrector.org/demo/c4f35db2-fe8d-4dde-bf3c-29c580dc60a1


## New features and enhancements

### `JSON` logger

We have a new `JSON` logger that can be useful for CI and any other place where results of Mutation Testing need to be analyzed **programmatically**.

This logger is used by Infection Playground to build the following UI:

![jsonlogger](/images/posts/0-17-0/json_logger_ui.png)

This report contains all the mutations (killed, escaped, timeouted, uncovered, etc.), original and mutated code and *result output of a test framework* for each Mutant.

### Set `failOnRisky`, `failOnWarning` to `true` if parameters are not already set

[#1273](https://github.com/infection/infection/issues/1273) showed that there are cases where a mutation may cause a test to become risky, yet these tests are not a cause of failure for PHPUnit by default.

Since PHPUnit won't treat new risky tests as failures by default, and since this behavior causes an unnecessary confusion even for experienced users (see #1273), we now add `failOnRisky="true"` and `failOnWarning="true"` by default unless a conflicting directive is present.

### `--force-progress` option

Previously, we introduced [`--no-progress`](/guide/command-line-options.html#no-progress) option that is automatically enabled on CI.

* It disables intermediate buffering of mutations used to count them. This causes progress bars to not have a total number of mutations displayed, while also reducing memory usage and speeding up the entire process. It is beneficial during CI, and for larger projects.
* It disables dynamic progress bars output to reduce the amount of generated text output.

Now, if you want to opt-out from this autoenabled behavior on CI, you can use `--force-progress` option. It outputs progress bars and mutation count during progress even if a CI is detected.

## New Mutators

### `InstanceOf_` mutator

```diff
- if ($node instanceof Node\Expr\Closure) {
+ if (true) {
+ if (false) {
```

Replaces: `$foo instanceof Anything`

With either `true` or `false`.

* When `true` we assume the value always of the same type, and the check is redundant.
* When `false` we assume the testing isn't thorough.


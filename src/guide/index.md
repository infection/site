---
title: Introduction
type: guide
order: 1
---

## What is Mutation Testing?

Mutation Testing is a fault-based testing technique which provides a testing criterion called the *Mutation Score Indicator (MSI)*. The MSI can be used to measure the effectiveness of a test set in terms of its ability to detect faults.

Mutation testing involves modifying a program in small ways. Each mutated version is called a **Mutant**. To assess the quality of a given test set, these mutants are executed against the input test set to see if the seeded faults can be detected. If mutated program produces failing tests, this is called a *killed mutant*. If tests are green with mutated code, then we have an *escaped* mutant. 

Test suites are measured by the percentage of mutants that they kill. New tests can be designed to kill additional mutants.

Mutants are based on well-defined **Mutators** ([mutation operators](./mutators.html)) that either mimic typical programming errors (such as using the wrong operator or variable name) or force the creation of valuable tests (such as dividing each expression by zero)

> Read more about Mutation Testing in [Mutation Testing Repository](http://crestweb.cs.ucl.ac.uk/resources/mutation_testing_repository/)

## What is Infection?

Infection is a **PHP mutation testing framework** based on AST (Abstract Syntax Tree) mutations. It works as a CLI tool and can be executed from your project's root. 

> Read a [detailed post](https://medium.com/@maks_rafalko/infection-mutation-testing-framework-c9ccf02eefd1) about Mutation Testing and Infection on Medium

Infection currently supports `PHPUnit`, `PhpSpec` and `Codeception` test frameworks, requires PHP 7.1+ and Xdebug/phpdbg/pcov installed.

In a nutshell, it 

* runs the test suite to see if all tests pass
* mutates the source code with a set of predefined mutators (mutation operators)
* for each Mutant (modified code with one change) it runs the tests that cover changed line
* analyzes whether the tests start to fail
* collects the results of killed, escaped Mutants, errors and timeouts

Given you have a `Form` class with `hasErrors()` method,

```php
// Form.php
public function hasErrors(): bool
{
    return count($this->errors) > 0;
}
```

Infection will create the following mutants:

Conditional boundary mutator:

```diff
public function hasErrors(): bool
{
-    return count($this->errors) > 0;
+    return count($this->errors) >= 0;
}
```

Conditional negotiation mutator:

```diff
public function hasErrors(): bool
{
-    return count($this->errors) > 0;
+    return count($this->errors) < 0;
}
```

Integer 0-1, 1-0 mutator:

```diff
public function hasErrors(): bool
{
-    return count($this->errors) > 0;
+    return count($this->errors) > 1;
}
```

and so on.

## Metrics. Mutation Score Indicator (MSI)

```
Metrics:
    Mutation Score Indicator (MSI): 47%
    Mutation Code Coverage: 67%
    Covered Code MSI: 70%
```

This example results reported a number of metric scores:

### Mutation Score Indicator (MSI)

MSI is 47%. This means that 47% of all generated mutations were detected (i.e. kills, timeouts or fatal errors). The MSI is the primary Mutation Testing metric. Given the code coverage of 65%, there is a 18% difference so Code Coverage was a terrible quality measurement in this example.

Calculation formula:

```
TotalDefeatedMutants = KilledCount + TimedOutCount + ErrorCount;

MSI = (TotalDefeatedMutants / TotalMutantsCount) * 100;
```


### Mutation Code Coverage

MCC is 67%. On average it should be within the same ballpark as your normal code coverage.

Calculation formula:

```
TotalCoveredByTestsMutants = TotalMutantsCount - NotCoveredByTestsCount;

CoveredRate = (TotalCoveredByTestsMutants / TotalMutantsCount) * 100;
```

### Covered Code Mutation Score Indicator

MSI for code *that is actually covered by tests* was 70% (ignoring not tested code). This shows you how effective the tests really are.

Calculation formula:

```
TotalCoveredByTestsMutants = TotalMutantsCount - NotCoveredByTestsCount;
TotalDefeatedMutants = KilledCount + TimedOutCount + ErrorCount;

CoveredCodeMSI = (TotalDefeatedMutants / TotalCoveredByTestsMutants) * 100;
```

If you examine these metrics, the standout issue is that the MSI of 47% is 18 points lower than the reported Code Coverage at 65%. These unit tests are far less effective than Code Coverage alone could detect.

Interpreting these results requires some context. The logs will list all undetected mutations as diffs against the original source code. Examining these will provide further insight as to what specific mutations went undetected.


## Ready for More?

We've just briefly introduced the basic information about Mutation Testing and Infection itself - the rest of this guide will cover other advanced features with much details, so make sure to read through it all!

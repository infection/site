---
title: Introduction
type: guide
order: 2
---

## What is Mutation Testing?

Mutation Testing is a fault-based testing technique which provides a testing criterion called the *Mutation Score Indicator (MSI)*. The MSI can be used to measure the effectiveness of a test set in terms of its ability to detect faults.

Mutation testing involves modifying a program in small ways. Each mutated version is called a **Mutant**. To assess the quality of a given test set, these mutants are executed against the input test set to see if the seeded faults can be detected. If mutated program produces failing tests, this is called a *killed mutant*. If tests are green with mutated code, the we have an *escaped* mutant. 

Test suites are measured by the percentage of mutants that they kill. New tests can be designed to kill additional mutants.

Mutants are based on well-defined **Mutators** ([mutation operators](./mutators.html)) that either mimic typical programming errors (such as using the wrong operator or variable name) or force the creation of valuable tests (such as dividing each expression by zero)

> Read more about Mutation Testing in [Mutation Testing Repository](http://crestweb.cs.ucl.ac.uk/resources/mutation_testing_repository/)

## What is Infection?

Infection is a **PHP mutation testing framework** based on AST (Abstract Syntax Tree) mutations. It works as a CLI tool and can be executed from your project's root. 

Infection currently supports `PHPUnit` and `PhpSpec` test frameworks, requires PHP 7+ and xDebug installed.

In a nutshell, it 

* runs the test suit
* mutates the source code with a set of predefined mutators (mutation operators)
* collects the results of killed, escaped mutants and timeouts

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

## Ready for More?

We've just briefly introduced the basic information about Mutation Testing and Infection itself - the rest of this guide will cover other advanced features with much details, so make sure to read through it all!

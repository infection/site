---
title: Command Line Arguments
type: guide
order: 39
is_new: true
---

Starting from version 0.34, Infection supports positional arguments to scope Mutation Analysis to source paths, tests paths or both.

```shell
infection src/Domain
```

will mutate all files inside `src/Domain`.

```shell
infection src/Domain/UserRepository.php
```

will mutate just one file `src/Domain/UserRepository.php`.

Mutating several folders, files or mix is also possible:

```shell
infection src/Domain src/Infrastructure src/Some/ConcreteFile.php
```

In general, you can pass the argument(s) containing:

- a relative file path:
``` bash
infection src/Service/Mailer.php
```

- a filename:
``` bash
infection Mailer.php
```

- a relative directory path:
``` bash
infection src/Service/
```

- a space separated list of relative paths:
``` bash
infection src/Service/Mailer.php src/Entity/Foobar.php
```
- a space separated list of filenames:
``` bash
infection Mailer.php Foobar.php
```

This in no way restricts the initial Infection check on the overall test suite, which is still executed in full to ensure all tests are passing correctly before proceeding.

> You can check the result of the filter applied by using `infection config:list-sources <filter>`

----

To specify what test(s) needs to be executed, you can run

```shell
infection tests/Domain
```

This will run only `tests/Domain` tests and mutate only those files that marked as covered by these tests.

> For PHPUnit, this boils down to `phpunit tests/Domain`

Specifying several folders, files or mix is also possible:

```shell
infection tests/Domain tests/Infrastructure tests/Some/ConcreteTestFile.php 
```

# Best for performance

Even if you are working on a big project with slow tests suite, you can greatly benefit from specifying both path to a source file and covering test:

```shell
infection src/Domain/UserRepository.php tests/Domain/UserRepositoryTest.php
```

In this case, Infection will run only `tests/Domain/UserRepositoryTest.php` test and mutate only `src/Domain/UserRepository.php`.

If for PHPUnit you use `#[CoversClass(UserRepository::class)]` for `UserRepositoryTest.php`, these both calls are equivalent:

```shell
infection src/Domain/UserRepository.php tests/Domain/UserRepositoryTest.php

infection tests/Domain/UserRepositoryTest.php
```

## Partial name matching

If you don't want to provide full paths, Infection also accepts bare filenames (with or without the `.php` extension), matching any file whose name contains the given string:

```shell
infection Mailer
infection Mailer.php
infection Plus_
```

## Any order is supported

Source paths and test paths can be mixed in **any order**. Infection detects which arguments are source files and which are test files automatically:

```bash
# source first, then tests
infection src/Service/Mailer.php tests/Unit/Service/MailerTest.php

# tests first, then source - identical result
infection tests/Unit/Service/MailerTest.php src/Service/Mailer.php
```

## N mixed paths

You can pass as many source and test paths as you need, in any combination:

```shell
infection src/Differ/Differ.php tests/Differ src/Mutator/Plus_.php tests/Mutator/Plus_.php
```

This will:
- Mutate `src/Differ/Differ.php` and all files matching `Plus_.php`
- Run only `tests/Differ` and `tests/Mutator/Plus_.php` tests

## All supported forms at a glance

| Command | Effect |
|---|---|
| `infection src/Service/Mailer.php` | Mutate one source file |
| `infection src/Service/` | Mutate entire source folder |
| `infection Mailer.php` | Mutate all files named `Mailer.php` |
| `infection Mailer` | Mutate all files matching `Mailer` |
| `infection src/A.php src/B.php` | Mutate multiple source files |
| `infection tests/Unit/` | Run only tests in `tests/Unit/` |
| `infection tests/Unit/MailerTest.php` | Run one test file |
| `infection src/Service/Mailer.php tests/Unit/MailerTest.php` | Mutate one file, run one test |
| `infection src/Service/ tests/Unit/` | Mutate folder, run test folder |
| `infection src/A.php tests/A src/B.php tests/B` | N mixed paths in any order |


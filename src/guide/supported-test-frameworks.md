---
title: Supported Test Frameworks
type: guide
order: 15
is_new: false
---

Infection supports the following Test Frameworks:

* [PHPUnit](https://phpunit.readthedocs.io/en/latest/)
* [PhpSpec](http://www.phpspec.net/en/stable/)
* [Pest](https://pestphp.com/)
* [Codeception](https://codeception.com/)

If you are using [Phar distribution](/guide/installation.html#Phar) (downloading Phar or using [Phive](/guide/installation.html#Phive)), all the test frameworks are bundled into it.

If you are using `infection/infection` package, only `PHPUnit` and `Pest` are bundled. Additional Test Frameworks will be automatically installed on demand.

For example, running

```bash
infection --test-framework=codeception
```

will notice that adapter is not installed and it will propose to install it in the same process:

```bash
We noticed you are using a test framework supported by an external Infection plugin.
Would you like to install infection/codeception-adapter? [yes]:

Installing infection/codeception-adapter...
```

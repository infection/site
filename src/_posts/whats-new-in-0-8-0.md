layout: post
title: What's new in Infection 0.8.0
date: 2018-02-28 00:40:12
type: '{{type}}'
---

Release: https://github.com/infection/infection/releases/tag/0.8.0

## BC Breaks

Before upgrading, make sure you know about backward incompatible changes.

1. `exclude` setting has been removed from the config file `infection.json`. Instead, please use `excludes`. This was done to make Infection's config file compatible with Humbug's one.

2. All paths from the config file are now relative to the config file instead of to the current working directory.

## New features and enhancements

### Pass existing coverage

In Infection 0.8.0, we have implemented a feature that allows providing existing Coverage Reports from `PHPUnit` and/or `PhpSpec` to Infection. 

Why is it needed?

When you use Continuous Integration for your project, probably you are already generating code coverage metrics and run PHPUnit with `XDebug`/`phpdbg` enabled. Then, you run Infection for mutation testing, which in its turn, generates Code Coverage again for internal needs. This dramatically increases the build time because running your tests with debugger *twice* requires too much time.

Now it's possible to reuse already generated coverage in Infection. Assuming you have PHPUnit, just do it as following:

``` bash
# collect XML and JUnit coverage
vendor/bin/phpunit --coverage-xml=build/coverage/coverage-xml --log-junit=build/coverage/phpunit.junit.xml

# use coverage
infection.phar --coverage=build/coverage --threads=4
```

Moreover, **Infection does not require `XDebug`/`phpdbg` enabled** if coverage is provided. It means, before running Infection you can disable debugger at all.

### Pass PHP options to Initial Tests run process

Not all people have `Xdebug` enabled permanently. You may like running scripts by `php -d zend_extension=xdebug.so script.php` command in order to debug it.

Before, it was not possible to run Infection in such a way. Since Infection needs debugger just for _Initial Tests Run_ step to generate code coverage, we've added a new option where you can pass additional parameters to PHP executable for this process - `--initial-tests-php-options`.

Assuming Xdebug is *disabled*, you can run it as:

```bash
infection.phar --initial-tests-php-options="-d zend_extension=xdebug.so"
```

## New Mutators

Two new mutators have been added:

### Throw Mutator

``` diff
- throw new \FileNotFoundException('...');
+ new \FileNotFoundException('...');
```

You can run only this mutation operator to see how good your MSI is for exceptions testing:

```bash
infection.phar --mutators=Throw_
```

### Integer Decrement and Increment Mutators

```diff
$users = [new User('Ivan', 17), new User('Ann', 23)];

// Decrement Mutator
- $adults = array_filter($users, function (User $user) { return $user->getAge() >= 21 });
+ $adults = array_filter($users, function (User $user) { return $user->getAge() >= 20 });

// Increment Mutator
- $adults = array_filter($users, function (User $user) { return $user->getAge() >= 21 });
+ $adults = array_filter($users, function (User $user) { return $user->getAge() >= 22 });
```

# Other updates

Besides that, we've improved mutation testing for Traits, improved Public/Protected Visibility mutators a little bit: they don't mutate abstract methods anymore.

There was some work to improve Infection Performance. Now, all generated mutants are reused, which reduces filesystem operations.

[Full Changelog](https://github.com/infection/infection/releases/tag/0.8.0)

-----


If you didn't try Infection with your CI process, now it's the best time.

Thanks everyone involved!
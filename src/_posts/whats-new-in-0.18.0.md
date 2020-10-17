layout: post
title: What's new in Infection 0.18.0
date: 2020-10-20 12:11:23
type: '{{type}}'
---

Release: https://github.com/infection/infection/releases/tag/0.18.0

## New features and enhancements

### Exclude mutations matching the source code by Regular Expression

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

`global-ignoreSourceCodeByRegex` allows to apply the `ignoreSourceCodeByRegex` setting to all mutators & profiles registered and works similar to `global-ignore` setting.

> Read more about [`ignore`](/guide/how-to.html#Disable-in-particular-class-or-method-or-line) and [`ignoreSourceCodeByRegex`](/guide/how-to.html#Do-not-mutate-the-source-code-matched-by-regular-expression) settings



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

### Allow fractional values for timeout

Allows fractional values for timeout. For example: half a second.

`infection.json`:

```json
{
  "timeout": 0.5
}
```

## New Mutators

### `SharedCaseRemoval` mutator

Code like this:

```php
switch ($value) {
  case 'a':
    doSomething();
    break;
  case 'b':
  case 'c':
  default:
    doSomethingElse();
    break;
}
```

Creates the following mutants:

```diff
switch ($value) {
  case 'a':
    doSomething();
    break;
-  case 'b':
  case 'c':
  default:
    doSomethingElse();
    break;
}
```

```diff
switch ($value) {
  case 'a':
    doSomething();
    break;
  case 'b':
-  case 'c':
  default:
    doSomethingElse();
    break;
}
```

```diff
switch ($value) {
  case 'a':
    doSomething();
    break;
  case 'b':
  case 'c':
-  default:
    doSomethingElse();
    break;
}
```

This mutator removes only shared cases because there is no way to see they are missing tests by looking at the code coverage.

------

Enjoy!

<a class="github-button" href="https://github.com/infection/infection" data-icon="octicon-star" data-show-count="true" aria-label="Star infection/infection on GitHub">Star</a>
<script async defer src="https://buttons.github.io/buttons.js"></script>

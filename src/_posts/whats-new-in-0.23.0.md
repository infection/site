layout: post
title: What's new in Infection 0.23.0
date: 2021-05-13 18:55:19
type: '{{type}}'
---

Release: https://github.com/infection/infection/releases/tag/0.23.0

## BC Breaks

* Ignoring mutating code commented with `@codeCoverageIgnore` is no longer supported. Use `@infection-ignore-all` instead. See https://infection.github.io/guide/usage.html#infection-ignore-all-support 

## Pest Test Framework support

[Pest](https://pestphp.com/) is getting more and more popular nowadays. Together with the Pest team, we've added support for this test framework in Infection.

Install Infection using for example Composer package:

```bash
composer require infection/infection --dev
```

Then, you can run mutation testing for Pest:

```bash
XDEBUG_MODE=coverage vendor/bin/infection --test-framework=pest --show-mutations
```


------

Enjoying Infection? Consider supporting us on GitHub Sponsors ♥️ 

https://github.com/sponsors/infection

<a class="github-button" href="https://github.com/infection/infection" data-icon="octicon-star" data-show-count="true" aria-label="Star infection/infection on GitHub">Star</a>
<script async defer src="https://buttons.github.io/buttons.js"></script>

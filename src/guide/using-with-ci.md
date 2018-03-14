---
title: Using with CI
type: guide
order: 6
---

## CLI options

We like the idea of using Infection together with other code quality tools in your Continuous Integration (CI) server.

For this purpose, there are two available options:

* `--min-msi`
* `--min-covered-msi`

```
Metrics:
    Mutation Score Indicator (MSI): 47%
    Mutation Code Coverage: 67%
    Covered Code MSI: 70%
```

The first option `--min-msi` allows to control your [Mutation Score Indicator](./index.html#Mutation-Score-Indicator-MSI). As soon as the actual MSI value is below than the value you provided by this option your build will fail.

Example of usage in CI server:

``` bash
./infection.phar --min-msi=48 --threads=4
```

This example means that if you get MSI `47%`, the build will be failed. **This forces you to write more tests with each commit.**

The second option `--min-covered-msi` allows to control [Covered Code MSI](./index.html#Covered-Code-Mutation-Score-Indicator).

As soon as the actual Covered Code MSI value is below than the value you provided by this option your build will fail.

Example of usage in CI server:

``` bash
./infection.phar --min-covered-msi=70 --threads=4
```

**This forces you to write more effective tests.**

Both these options can be used together. As soon as one of them is failed - the build will also be failed.

Example:

``` bash
./infection.phar --min-msi=48 --min-covered-msi=70 --threads=4
```

## Using with Travis

The simplest `.travis.yml` config to integrate Infection with Travis is:

``` yml
before_script:
    - wget https://github.com/infection/infection/releases/download/0.8.0/infection.phar
    - wget https://github.com/infection/infection/releases/download/0.8.0/infection.phar.pubkey
    - chmod +x infection.phar

script:
    - ./infection.phar --min-msi=48 --threads=4
```

> [Read more](./mutation-badge.html) about how to add a Mutation Badge to your Github Project

[![Infection MSI](https://badge.stryker-mutator.io/github.com/infection/infection/master)](https://infection.github.io)

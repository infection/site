layout: post
title: What's new in Infection 0.26.0
date: 2022-01-10 19:24:18
type: '{{type}}'
---

Release: https://github.com/infection/infection/releases/tag/0.26.0

## BC Breaks

`badge` logger has been replaced with more advanced `stryker` logger. Previously, to use Stryker Dashboard for uploading MSI score and display badge information, the following setting was used:

```json infection.json
{
    "logs": {
        "badge": {
            "branch": "main"
        }
    }
}
```

Now, the same behavior can be achieved by using `stryker` logger:

```json infection.json
{
    "logs": {
        "stryker": {
            "badge": "main"
        }
    }
}
```

## New features and updates

### HTML report (local and cloud)

It's now possible to generate HTML reports, similar to PHPUnit HTML report, for Infection execution.

![html-report-git](https://user-images.githubusercontent.com/3725595/147268213-615dd107-a21e-4736-89c9-f12634c1a562.gif)

![infection-html-all](https://user-images.githubusercontent.com/3725595/147269162-74d6a2ea-e9db-4640-902b-c8b0f95828aa.png)

* Example of a local report: [html-report-example.html](/static/html-report-example.html)
* Example of a report stored in Stryker Dashboard: https://dashboard.stryker-mutator.io/reports/github.com/infection/infection/master

To generate HTML report locally, the new `html` logger should be used:

```json infection.json
{
    "logs": {
        "html": "infection.html"
    }
}
```

To upload HTML report to Stryker Dashboard, please read [this guide](/guide/mutation-badge.html) for setting up integration and upload it by:

```json infection.json
{
    "logs": {
        "stryker": {
            "report": "/^release-.*$/"
        }
    }
}
```

### Mutating only affected `lines`

In the previous Infection versions, it was possible to mutate only added and changed files:

```bash
infection --git-diff-filter=AM
```

However, if you have a big legacy project, changing 1 line in a file with thousands of lines led to too many mutants, that not always possible to kill due to lack of the tests / time.

Now, we've added a new feature that mutates only touched lines of code - new or modified:

```bash
infection --git-diff-lines
```

Under the hood, this option mutates only added and changed files, then only added and changed lines in these files, comparing your current branch with `master` branch by default.

Base branch can be changed by using `--git-diff-base=main` option. In this case, your current branch will be compared with `main` branch.

```bash
infection --git-diff-lines --git-diff-base=main
```

Useful to check how your changes impacts MSI in a feature branch.

Can significantly improve performance since fewer Mutants are generated in comparison to using `--git-diff-filter=AM` or mutating all files.

### Show ignored mutants

There is a setting to [ignore mutations by adding a regular expression](/guide/how-to.html#Do-not-mutate-the-source-code-matched-by-regular-expression) for matching the source code:

```json infection.json
{
    "mutators": {
        "global-ignoreSourceCodeByRegex": [
            "Assert::.*"
        ]
    }
}
```

but it wasn't clear whether Infection applies it or not. Now, the output will contain `I` chars for ignored Mutants:

```diff
 Processing source code files: 7/7
-.: killed, M: escaped, U: uncovered, E: fatal error, X: syntax error, T: timed out, S: skipped
+.: killed, M: escaped, U: uncovered, E: fatal error, X: syntax error, T: timed out, S: skipped, I: ignored
 
 ..................................................   ( 50 / 544)
 ..................................................   (100 / 544)
 ..................................................   (150 / 544)
 ..............T...................................   (200 / 544)
 ............T.....................................   (250 / 544)
-...................TT
+...................TTIIIIIIIIIIIIIIIIIIIIIIIIIIIII   (300 / 544)
+IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII   (350 / 544)
+IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII   (400 / 544)
+IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII   (450 / 544)
+IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII   (500 / 544)
+IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII         (544 / 544)
 
 271 mutations were generated:
      267 mutants were killed
+     273 mutants were configured to be ignored
        0 mutants were not covered by tests
        0 covered mutants were not detected
        0 errors were encountered
        0 syntax errors were encountered
        4 time outs were encountered
        0 mutants required more time than configured

 Metrics:
          Mutation Score Indicator (MSI): 100%
          Mutation Code Coverage: 100%
          Covered Code MSI: 100%
```

### Automatic `XDEBUG_MODE=coverage`

Previously, with `Xdebug` 3+, Infection had to be executed with `XDEBUG_MODE=coverage` if `mode` has no `coverage` value by default in order to generate coverage for internal purposes:

```bash
XDEBUG_MODE=coverage infection
```

Now, you can skip it and just run


```bash
infection
```

`coverage` mode will be used automatically.

### Set `failOnRisky`, `failOnWarning` to `true` if parameters are not already set for Mutants

There can be a situation when mutation leads to generating a warning, and if you don't have `failOnWarning` set to true - such Mutant becomes escaped. Now Infection will kill such Mutants.



------

Enjoying Infection? Consider supporting us on GitHub Sponsors ♥️

https://github.com/sponsors/infection

<a class="github-button" href="https://github.com/infection/infection" data-icon="octicon-star" data-show-count="true" aria-label="Star infection/infection on GitHub">Star</a>
<script async defer src="https://buttons.github.io/buttons.js"></script>

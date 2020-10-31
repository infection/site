layout: post
title: What's new in Infection 0.20.0
date: 2020-11-01 12:11:25
type: '{{type}}'
---

Release: https://github.com/infection/infection/releases/tag/0.20.0

## New features and enhancements

### Github Annotations logger 🚀

This logger is supposed to be used only with GitHub Actions. It prints GitHub Annotation warnings for *escaped* Mutants right in the Pull Request:

![GitHub Annotation Escaped Mutant](/images/github-logger.png)

Usage (look at [the real example](https://github.com/infection/infection/blob/bef65fc22faa200edd367ffe12596905947a2a93/.github/workflows/mt-annotations.yaml#L50-L52) how Infection uses it itself):

```bash
# this is needed on GitHub Actions to fetch the base branch to make a diff
git fetch --depth=1 origin main

infection.phar --logger-github --git-diff-filter=AM
```

> Read below why you may need to use `--git-diff-filter` option

It's also possible to configure this logger in `infection.json` file. Results will be printed to `stdout`:

```json
{
    "logs": {
        "github": true
    }
}
```

### `--git-diff-filter` option

Allows filtering files to mutate by using `git diff` with `--diff-filter` option. Sensible values are: `AM` - added and modified files. `A` - only added files.

Best to be used during pull request builds on CI, e.g. with GitHub Actions, Travis CI and so on.

Usage:

```bash
# this is needed on GitHub Actions to fetch the base branch to make a diff
git fetch --depth=1 origin main

infection.phar --git-diff-filter=A
```

This command will mutate only those files, that were *added* in the Pull Request. The diff is done between the current branch and the base branch.

> It's possible to configure the base branch, see [`--git-diff-base`](/guide/command-line-options.html#git-diff-base) option

### `--git-diff-base` option

Supposed to be used only with [`--git-diff-filter`](/guide/command-line-options.html#git-diff-filter) option. Configures the base branch for `git diff` command.

Usage:

```bash
# this is needed on GitHub Actions to fetch the base branch to make a diff
git fetch --depth=1 origin main

infection.phar --git-diff-base=origin/main --git-diff-filter=AM
```



## New Mutators

### `Ternary` mutator

This mutator mutates a ternary operator:

```diff
- isset($b) ? 'B' : 'C';
+ isset($b) ? 'C' : 'B';
```

```diff
$foo = 'foo';
- $foo ?: 'bar';
+ $foo ? 'bar' : $foo;
```

### `Coalesce` mutator

Mutates:

```diff
$foo = 'foo';
$bar = 'bar';
- $foo ?? $bar;
+ $bar ?? $foo;
```

Or more complex case with nested values:

```diff
$foo = 'foo';
$bar = 'bar';
$baz = 'baz';

- $foo ?? $bar ?? $baz;
+ $foo ?? $baz ?? $bar;

- $foo ?? $bar ?? $baz;
+ $bar ?? $foo ?? $baz;
```

### `UnwrapSubstr` mutator

```diff
- $x = substr('abcde', 0, -1);
+ $x = 'abcde';
```

### `UnwrapStrRev` mutator

```diff
- $x = strrev('Hello!');
+ $x = 'Hello!';
```

### `UnwrapLtrim` mutator

```diff
- $x = ltrim(' Hello!');
+ $x = ' Hello!';
```

### `UnwrapRtrim` mutator

```diff
- $x = rtrim('Hello! ');
+ $x = 'Hello! ';
```

### `UnwrapStrIreplace` mutator

```diff
- $x = str_ireplace('%body%', 'black', '<body text=%BODY%>');
+ $x = '<body text=%BODY%>';
```

### `UnwrapStrShuffle` mutator

```diff
- $x = str_shuffle('Hello!');
+ $x = 'Hello!';
```

------

Enjoy!

<a class="github-button" href="https://github.com/infection/infection" data-icon="octicon-star" data-show-count="true" aria-label="Star infection/infection on GitHub">Star</a>
<script async defer src="https://buttons.github.io/buttons.js"></script>

layout: post
title: What's new in Infection 0.10.0
date: 2018-08-11 21:51:31
type: '{{type}}'
---

Release: https://github.com/infection/infection/releases/tag/0.10.0

## BC Breaks

Before upgrading, make sure you know about backward incompatible changes.

* Infection now requires PHP 7.1+. If you can't for some reason upgrade and stuck on 7.0, don't worry, you can still use 0.9.0.
* PHAR file is no longer signed with OpenSSL built-in algorithm. See below.

## New features and enhancements

### Phive

Infection now can be installed by [Phive](https://phar.io/) - The PHAR Installation and Verification Environment. Since Phive requires [GPG](https://www.gnupg.org/) singing, we dropped built-in PHP OpenSSL signing. For each release we will upload `infection.phar` and `infection.phar.asc`. Previously downloaded `infection.phar.pubkey` can be deleted.

With Phive you can install Infection as

```bash
phive install infection
```

You can still download the PHAR file manually, the process is almost the same:

```bash
wget https://github.com/infection/infection/releases/download/0.10.0/infection.phar
wget https://github.com/infection/infection/releases/download/0.10.0/infection.phar.asc

chmod +x infection.phar
```

Verify integrity:

```bash
gpg --keyserver hkps.pool.sks-keyservers.net --recv-keys 493B4AA0

gpg --with-fingerprint --verify infection.phar.asc infection.phar
```

You should see something like:

```bash
gpg: Signature made Sun Aug  5 21:46:42 2018 +03
gpg:                using RSA key XYZ
gpg: Good signature from "Infection PHP <maks.rafalko@gmail.com>" [ultimate]
Primary key fingerprint: C6D7 6C32 9EBA DE2F B9C4  58CF C509 5986 493B 4AA0
```

### Homebrew

There was a reorganization of taps in Homebrew PHP and not all previously existed packages have been moved to the Homebrew core, including Infection. 

We created our custom repository so you can continue using `brew` to install Infection:

```brew
brew tap infection/homebrew-infection
brew install infection
```

Thanks [Pierre du Plessis](https://github.com/pierredup) for helping and maintaining it!

### Time and memory

Infection now outputs information about how much time and memory did it take to run mutation testing:

```bash
[...] 

M..M...M..SSSSSSSSSS.......M...........SSSS.MSSSSS   (50 / 50)

Time: 4s. Memory: 20.00MB
```

### Sorting the log file

When you have hundreds or even thousands of mutations, and especially when you use `--threads`, it's quite difficult to read log file because each time mutations were logged in a random order (due to parallel processes).

Now mutations are sorted by file path and then by line of the mutation:

```text
3) Domain/Model/Goal/Goal.php:82    [M] MethodCallRemoval

4) Domain/Model/Goal/Goal.php:83    [M] MethodCallRemoval

5) Domain/Model/Goal/Goal.php:113    [M] PublicVisibility
```

## New Mutators

### `FunctionCallRemoval` and `MethodCallRemoval`

These two mutators will remove function or method calls that are not part of another statement (e.g. `if`/`loop`), or get assigned to a value.

This should help make sure that your tests are covering side effects caused by an action.

```diff
-        ksort($this->calculatorPerMutator);
+        
```

or

```diff
-        $this->eventDispatcher->dispatch(new InitialTestSuiteStarted());
+        
```

### `PregMatchMatches`

Helps to check you are correctly testing the logic of `preg_match()` calls:

```diff
- preg_match('/a/', 'abc', $foo);
+ $foo = array();
```

### `Coalesce`

This mutator removes condition part of `Coalesce` operator (`$a ?? $b` -> `$b`):

```diff
private function getListeners(string $eventName): array
{
-    return $this->listeners[$eventName] ?? [];
+    return [];
}
```

------

Enjoy!

<a class="github-button" href="https://github.com/infection/infection" data-icon="octicon-star" data-show-count="true" aria-label="Star infection/infection on GitHub">Star</a>
<script async defer src="https://buttons.github.io/buttons.js"></script>
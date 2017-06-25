---
title: Installation
type: guide
order: 1
vue_version: 2.3.0
dev_size: "247.31"
min_size: "76.64"
gz_size: "28.03"
ro_gz_size: "19.54"
---

### Compatibility Note

Infection requires PHP 7+, xDebug enabled.

<!-- ### Release Notes
Detailed release notes for each version are available on [GitHub](https://github.com/vuejs/vue/releases).
-->

## Composer

You can install it globally as any other general purpose tool:

``` bash
composer global require infection/infection
```

Do not forget to include it to `~/.bash_profile` (or `~/.bashrc`)!

``` bash
export PATH=~/.composer/vendor/bin:$PATH
```

After that, you will be able to run Infection from project root:

``` bash
# cd /path/to/project/root

infection --threads=4
```

## Phar

Coming soon...

## Git

<p class="tip">This installation type is suitable for Infection development purposes or as a quickest (but not the best) way to try it locally for your project. </p>

``` bash
git clone https://github.com/infection/infection.git
cd infection
composer install
```

Runnable infection command will be available at `bin/infection`. Assuming that you have installed Infection to `~/infection`, you can run mutation testing for you project in such way:

``` bash
# cd /path/to/project/root

~/infection/bin/ingection
```


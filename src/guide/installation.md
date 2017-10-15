---
title: Installation
type: guide
order: 2
---

### Compatibility Note

Infection requires PHP 7+, xDebug or phpdbg enabled.

## Phar

Phar distribution is the best and recommended way of installing Infection on your computer.

Download the latest `infection.phar` and `infection.phar.pubkey`:

``` bash
wget https://github.com/infection/infection/releases/download/0.6.0/infection.phar
wget https://github.com/infection/infection/releases/download/0.6.0/infection.phar.pubkey

chmod +x infection.phar
```

Additionally, it can be copied to `/usr/local/bin` to make it available globally in the terminal:
 
``` bash
mv infection.phar /usr/local/bin/infection
mv infection.phar.pubkey /usr/local/bin/infection.pubkey

# and then run just like

infection
```

### Updating the Phar file

Nice advantage of Phar distribution is that it has a command to update itself

``` bash
./infection.phar self-update
```

> Read more about self-update command [here](/guide/usage.html#Updating-Phar-distribution)

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

~/infection/bin/infection
```


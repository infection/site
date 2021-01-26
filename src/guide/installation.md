---
title: Installation
type: guide
order: 2
---

### Compatibility Note

Infection requires a recent version of PHP, and `XDebug`, `phpdbg`, or `pcov` enabled.

You can still use an older Infection version if you're using an older PHP version.

| PHP version | Infection version |
|---|---|
| 7.4.0 | >= 0.18 |
| 7.3.12 | 0.16-0.17 |
| 7.2.9+ | 0.14-0.15 |
| 7.1 | 0.10 - 0.13 |
| 7.0 | < 0.10 |

## Phar

Phar distribution is the best and recommended way of installing Infection on your computer. Unlike `infection/infection`, it is bundled with all officially supported Test Frameworks: `PHPUnit`, `PhpSpec`, `Codeception`.

Download the latest `infection.phar` and `infection.phar.asc`:

``` bash
wget https://github.com/infection/infection/releases/download/0.21.0/infection.phar
wget https://github.com/infection/infection/releases/download/0.21.0/infection.phar.asc

chmod +x infection.phar
```

The PHAR is signed [with our GPG key](/files/infection.pub). In order to verify whether the PHAR file was signed by Infection team, execute the following:

```bash
gpg --recv-keys C6D76C329EBADE2FB9C458CFC5095986493B4AA0
gpg --with-fingerprint --verify infection.phar.asc infection.phar
```

You should see something like:

```bash
gpg: Signature made Sun Aug  5 21:46:42 2018 +03
gpg:                using RSA key XYZ
gpg: Good signature from "Infection PHP <maks.rafalko@gmail.com>" [ultimate]
Primary key fingerprint: C6D7 6C32 9EBA DE2F B9C4  58CF C509 5986 493B 4AA0
```

Make sure fingerprint is equal to `C6D7 6C32 9EBA DE2F B9C4  58CF C509 5986 493B 4AA0`.

Additionally, it can be copied to `/usr/local/bin` to make it available globally in the terminal:
 
``` bash
mv infection.phar /usr/local/bin/infection

# and then run just like

infection
```

## Phive

Infection can also be installed by [Phive](https://phar.io/) - The PHAR Installation and Verification Environment.

```bash
phive install infection
```

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

## Homebrew

Infection can be installed through Homebrew

``` bash
brew tap infection/homebrew-infection
brew install infection
```

Homebrew automatically links the executable in the `/usr/local/bin` directory so that it is available globally.
You can then run Infection from project root:

``` bash
infection
```

Tap repository: https://github.com/infection/homebrew-infection/

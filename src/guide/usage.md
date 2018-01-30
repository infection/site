---
title: Usage
type: guide
order: 3
---

## Configuration

The first time you run Infection for your project, it will ask you several questions to create a config file `infection.json.dist`, whith the following structure:

``` json
{
    "source": {
        "directories": [
            "src"
        ],
        "excludes": [
            "Config",
            "Folder/with/File.php"
        ]
    },
    "timeout": 10,
    "logs": {
        "text": "infection-log.txt"
    },
    "tmpDir": "/opt/my-favorite-folder",
    "phpUnit": {
        "configDir": "app",
        "customPath": "\/path\/to\/phpunit-6.1.phar"
    }
}
```

You can commit it to the VCS and, if necessary, override it locally by creating `infection.json` which should be ingored (e.g. in `.gitignore`).

### Configuration settings

* `source` section:
  * `directories` - array, contains all folders with source code you want to mutate. Can be `.`, but make sure to exclude `vendor` in this case.
  * `excludes` - array, contains all folders or files you want to exclude withing your source folders. You can use glob pattern (`*Bundle/**/*/Tests`) for them or just regular dir/file path. It should be relative to the source directory.
  Infection automatically excludes `vendor`, `test`, `tests` folders if the source folder is `.` (current dir). Make sure to not mutate your test suite.
  * `exclude` - **Deprecated!** and will be removed since 0.8. Works in the same way as `excludes`
* `timeout` - the allowed timeout configured for Infection. Make sure to set it to higher value than your tests are executed in seconds to avoid false-positives.
* `logs`
  * `text` - human readable text log file. Must see to understand what is going on during mutation process.
* `tmpDir` - Optional. It's a folder where Infection will create it's configs, caches and others stuff. It may be useful for people who doesn't have access to the default system temporary folder on and/or doesn't have write permissions. 
* `phpUnit` - optional key
  * `configDir` - custom directory path with `phpunit.xml.dist` file. This is useful for example for old Symfony app, where `phpunit.xml.dist` is located at `./app`
  * `customPath` - custom path to PHPUnit executable. This is useful when you run tests by external shared phar file that is located outside project root.

## Running Infection

Ensure that your tests are all in a passing state (incomplete and skipped tests are allowed). Infection will quit if any of your tests are failing.

If you have installed Infection as a global composer package, just run it in your project's root:

``` bash
infection
```

or if you cloned it to some folder:

``` bash
# cd /path/to/project/root

~/infection/bin/infection
```

### Running with `phpdbg`

In order to run infection with `phpdbg` instead of xDebug, you need to execute the following command:

```bash
phpdbg -qrr infection.phar
```

## Updating Phar distribution

The phar is signed with an `openssl` private key. You will need the pubkey file to be stored beside the phar file at all times in order to use it. If you rename `infection.phar` to `infection`, for example, then also rename the key from `infection.phar.pubkey` to `infection.pubkey`.

To update your current phar, just run:

``` bash
./infection.phar self-update
```

<p class="tip">Note: Using a phar means that fixes may take longer to reach your version, but there's more assurance of having a stable development version. The public key is downloaded only once. It is re-used by self-update to verify future phar releases.</p>

### Updating to pre-release versions

While we recommend to use the most stable releases, you can update it to pre-release version if available

``` bash
./infection.phar self-update --pre
```

### Check availability of new versions

It's possible to check if there is a new version available:

``` bash
./infection.phar self-update --check
```

### Self-Update Request Debugging

If you experience any issues self-updating with unexpected `openssl` or SSL errors, please ensure that you have enabled the `openssl` extension. For example on Windows, you can do this by adding or uncommenting the following line in the `php.ini` file for PHP on the command line (if different than the file for your http server):

``` bash
extension=php_openssl.dll
```

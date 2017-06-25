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
        "exclude": [
            "Config"
        ]
    },
    "timeout": 10,
    "logs": {
        "text": "infection-log.txt"
    }
}
```

You can commit it to the VCS and, if necessary, override it locally by creating `infection.json` which should be ingored (e.g. in `.gitignore`).

### Configuration settings

* `source` section:
  * `directories` - array, contains all folders with source code you want to mutate. Can be `.`, but make sure to exclude `vendor` in this case.
  * `exclude` - array, contains all folders you want to exclude withing your source folders. You can use glob pattern (`*Bundle/**/*/Tests`) for them or just regular dir path. It should be relative to the source directory.
  * `timeout` - the allowed timeout configured for Infection. Make sure to set to to higher value than your tests are executed in seconds to void false-positives.
  * `logs`
     * `text` - human readable text log file. Must see to understand what is going on during mutation process.
     
## Running Infection

Ensure that your tests are all in a passing state (incomplete and skipped tests are allowed). Infection will quit if any of your tests are failing.

If you have installed humbug as a global composer package, just run it in your project's root:

``` bash
infection
```

or if you cloned it to some folder:

``` bash
# cd /path/to/project/root

~/infection/bin/ingection
```


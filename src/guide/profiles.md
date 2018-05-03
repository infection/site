---
title: Profiles
type: guide
order: 6
---

Infection supports the use of mutator profiles for the command line and configuration file.

The following configuration file will use the `default` profile, but turn off the `function_signature` profile. 
On top of that, it does not apply the `TrueValue` mutator on any classes that match the provided ignore patterns.
These ignores can also be added to profiles, to ensure infection is as flexible as you need it. 

All profiles are prepended by an `@` and in snake case, while all mutators are in PascalCase. 

``` json
{
    "source": {
        "directories": [
            "src"
        ],
    },
    "timeout": 10,
    "logs": {
        "text": "infection-log.txt",
    }
    "mutators": {
        "@default": true,
        "@function_signature": false,
        "TrueValue": {
            "ignore": [
                "NameSpace\\*\\SourceClass::method",
                "Full\\NameSpaced\\Class"
            ]
        }
    }
}
```

### The Profiles

Currently, infection supports the following profiles:
* `@arithmetic`
* `@boolean`
* `@cast`
* `@conditional_boundary`
* `@conditional_negotiation`
* `@function_signature`
* `@number`
* `@operator`
* `@regex`
* `@return_value`
* `@sort`
* `@zero_iteration`
* `@default` - This is the default profile, which currently contains all mutators, and is used if no mutator or profile is chosen

>Feel free to request a new profile to be added in Github's issues.

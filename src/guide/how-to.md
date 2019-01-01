---
title: How-to Guides
type: guide
order: 9
---

## How to run Infection only for changed files

If you have thousands of files and too many tests, running Mutation Testing can take hours for your project. In this case, it's very convenient to run it only for the modified files.

Assuming you are on a feature branch, and the main branch is `master`, we can do it as the following:

```bash
CHANGED_FILES=$(git diff origin/master --diff-filter=AM --name-only | grep src/ | paste -sd "," -);
INFECTION_FILTER="--filter=${CHANGED_FILES} --ignore-msi-with-no-mutations";

infection --threads=4 $INFECTION_FILTER
```

The `--diff-filter=AM` returns only added and modified files, because we are not going to use removed ones.

The [`--ignore-msi-with-no-mutations` option](/guide/command-line-options.html#ignore-msi-with-no-mutations) tells Infection to not error on min MSI when we have `0` mutations.

#### Example for Travis CI:

```bash
jobs:
  include:
    - stage: Mutation Testing
    script:
      - |
        if [[ "${TRAVIS_PULL_REQUEST}" == "false" ]]; then
            INFECTION_FILTER="";
        else
            git remote set-branches --add origin $TRAVIS_BRANCH;
            git fetch;
            CHANGED_FILES=$(git diff origin/$TRAVIS_BRANCH --diff-filter=AM --name-only | grep src/ | paste -sd "," -);
            INFECTION_FILTER="--filter=${CHANGED_FILES} --ignore-msi-with-no-mutations";
            
            echo "CHANGED_FILES=$CHANGED_FILES";
        fi
        
        infection --threads=4 --log-verbosity=none $INFECTION_FILTER
```

For each job, Travis CI fetches only tested branch: 

```bash
git clone --depth=50 --branch=feature/branch
```
 
That's why we need to fetch `$TRAVIS_BRANCH` as well to make a `git diff` possible. Otherwise, you will get an error:

```bash
fatal: ambiguous argument 'origin/master': unknown revision or path not in the working tree.
```

---
title: Debugging Issues
type: guide
order: 11
is_new: true
---

There can be a situation, when Infection kills the Mutant, but if you do the same changes in the source code manually, tests pass.

Infection runs the tests **in a random order**, and if the project's tests suite is not ready for it, tests can fail because of reordering. Make sure to always run tests randomly:

```xml phpunit.xml
<phpunit executionOrder="random">
    <!--  ...  -->
</phpunit>
```

Another possible reason is that tests are not ready to be executed in parallel, when you use Infection with a `--threads=X` parameter.

Examples:

* tests read and write to the same database
* tests read and write to the same filesystem

in both cases, one test can override the data written by another test so that one of them fails.

In order to debug such issues, there is a special `--noop` option for it. When it's used, all mutators leave the code untouched, but Infection still runs the tests in order to kill such Mutants.

If everything works as expected, every Mutant should be escaped. For every mutation (which in fact is not a mutation at all) tests should pass, because the source code is not changed.

This is an example of how the output can look like:

```bash
bin/infection --noop

Processing source code files: 407/407
.: killed, M: escaped, U: uncovered, E: fatal error, T: timed out, S: skipped

UMMMMMMMMMM                                          (11 / 11)

11 mutations were generated:
       0 mutants were killed
       1 mutants were not covered by tests
      10 covered mutants were not detected
       0 errors were encountered
       0 time outs were encountered
       0 mutants required more time than configured

Metrics:
         Mutation Score Indicator (MSI): 0%
         Mutation Code Coverage: 90%
         Covered Code MSI: 0%
```

so, Mutants are either not covered by tests or escaped. It means tests are green for each noop mutator that just don't change the code.

If, for some reason, some Mutants are killed with `--noop`, then there is an issue. To further debug the reason, `--log-verbosity=all` option can be used to analyze `infection.log` file. Don't forget to enable [`text` logger](/guide/usage.html#Configuration-settings) in `infection.json` configuration file:

```json
{
    "logs": {
        "text": "infection.log"
    }
}
```

In this log file, you can see tests output for every Mutant, with the information about why tests fail.

---
layout: post
title: What's new in Infection 0.32.3
date: 2026-01-14 12:00:00
type: '{{type}}'
---

Release: https://github.com/infection/infection/releases/tag/0.32.3

## Timeout Control Options

Timeouts have been the silent killers of mutation testing quality. This release introduces two new options to give you visibility and control over timed-out mutants.

### The Problem

**MSI inflation**: On CI environments with weaker CPUs, mutations that would escape locally instead time out. Since timeouts count as "killed" mutants, your MSI score looks better than it actually is. A project reporting 97% MSI might actually have 87% if those timeouts were counted as escapes.

**Slow CI accumulation**: You fix all timeouts, Infection runs fast. You add a new feature - suddenly 20 new timeouts. Your CI now takes minutes longer. The worst part? There's no way to know they exist without digging through logs.

**Hidden infinite loops**: Some timeouts are legitimate (tests that genuinely take too long on slow CI). Others are mutations that create infinite loops - real test gaps that Infection promised to help you find, but they're hidden among the "acceptable" timeouts.

### The Solution: Two New Options

#### `--with-timeouts` / `timeoutsAsEscaped`

Treats timed-out mutants as escaped instead of killed. This affects MSI calculation - timeouts count against your score, giving you an honest picture of test quality.

```bash
# See your real MSI with timeouts counted as escaped
infection --with-timeouts --min-msi=80

# Show timed-out mutations in output
infection --with-timeouts --show-mutations
```

#### `--max-timeouts` / `maxTimeouts`

Fails the build if the number of timed-out mutants exceeds the specified threshold. This is purely a threshold check and does not affect MSI calculation.

```bash
# Fail if any timeouts occur (strict mode for PRs)
infection --git-diff-lines --max-timeouts=0

# Allow some timeouts but set a ceiling
infection --max-timeouts=10
```

### These Options Are Independent

The two options serve different purposes and can be used separately or together:

| Scenario | `--with-timeouts` | `--max-timeouts` |
|----------|-------------------|------------------|
| Stricter MSI only | Yes | No |
| Hard ceiling only | No | Yes |
| Both concerns | Yes | Yes |

Why not implicit? If `--max-timeouts=10` implicitly enabled `--with-timeouts`, a project with 9 timeouts and 100% MSI would suddenly fail - the timeouts would count as escaped, dropping MSI below 100%. These are orthogonal concerns: one affects metric calculation, the other is a hard limit.

### Configuration

Both options can be set in `infection.json5`:

```json infection.json5
{
    "timeoutsAsEscaped": true,
    "maxTimeouts": 10,
    "minMsi": 77
}
```

### Recommended Workflows

**For PRs: Zero Tolerance**

Prevent any new timeouts from being introduced:

```bash
infection --git-diff-lines --max-timeouts=0
```

**For Full Runs: Honest MSI**

Get accurate MSI that counts timeouts as test gaps:

```bash
infection --with-timeouts --min-msi=80
```

**Hunting Timeouts**

See all timed-out mutations to fix them:

```bash
infection --with-timeouts --show-mutations
```

This shows timed-out mutations in the console output, making them visible and actionable rather than hidden in logs.

## Performance Metrics Dashboard

We now track Infection's own performance over time with automated benchmarks on every release. The results are published to a public dashboard:

https://infection.github.io/infection-metrics/

Each benchmark run captures wall clock time, CPU time (user + system), total mutations generated, and peak memory usage. We also compute derived metrics like time per mutation to normalize across different codebases and detect regressions independent of test suite size.

This helps us catch performance regressions early and track improvements across releases.

------

Enjoying Infection? Consider supporting us on GitHub Sponsors

https://github.com/sponsors/infection

<a class="github-button" href="https://github.com/infection/infection" data-icon="octicon-star" data-show-count="true" aria-label="Star infection/infection on GitHub">Star</a>
<script async defer src="https://buttons.github.io/buttons.js"></script>

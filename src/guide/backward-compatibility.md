---
title: Backward Compatibility
type: guide
order: 25
---

Infection follows [Semantic Versioning](https://semver.org/) and provides a stronger backward-compatibility promise for its pre-1.0 releases.

This policy applies to all user-facing projects maintained by the Infection organisation, such as [`infection/infection`](https://github.com/infection/infection) and [`infection/abstract-testframework-adapter`](https://github.com/infection/abstract-testframework-adapter). It does not apply to internal projects, such as [`infection/site`](https://github.com/infection/site) or [`infection/benchmark-source`](https://github.com/infection/benchmark-source).

## Versioning policy

Before 1.0, each minor release is treated as a major release for backward-compatibility purposes. Backward-incompatible changes may be introduced in a new minor release, but not in a patch release. For example, `0.35.0` may contain changes that are incompatible with `0.34.x`, while `0.34.1` must remain compatible with `0.34.0`.

From 1.0 onwards, backward-incompatible changes may be introduced only in major releases.

This policy matches [Composer's handling of caret version constraints](https://getcomposer.org/doc/articles/versions.md#caret-version-range-). A constraint such as `^0.34` installs versions greater than or equal to `0.34.0` and lower than `0.35.0`. You can use it to receive compatible fixes without accepting a release that may contain backward-incompatible changes.

## What is covered

The backward-compatibility promise covers:

- PHP code that are part of Infection's public API.
- Non-debug command names and their accepted arguments and options.
- Configuration file keys and their accepted value types.

New features may be added while preserving these existing interfaces.

## What is not covered

The backward-compatibility promise does not cover:

- PHP code marked with `@internal`.
- commands whose names start with `debug:`.
- The content, formatting or ordering of command output.

These unsupported interfaces may change in any release. We still aim to limit disruption and welcome reports when a change has an unexpectedly large impact.

Security fixes may require an exceptional backward-incompatible change in a maintained release.

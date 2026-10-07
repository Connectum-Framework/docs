---
title: "ADR-025: Package Versioning Strategy"
description: Keep every Connectum package in one fixed release group with a shared version.
docType: adr
---

# ADR-025: Package Versioning Strategy

## Status

Accepted -- 2026-02-20; revised -- 2026-10-08.

The 2026-10-08 decision replaces the original plan to adopt Hybrid versioning
after 1.0.0 stable. **All `@connectum/*` packages retain one shared version.**
The current release is 1.2.0; 1.3.0 is being prepared and reviewed.

## Context

Connectum consists of modular packages in one pnpm monorepo. Users install the
capabilities they need, while maintainers release those packages together through
Changesets. Optional installation does not imply independent versioning.

The original decision proposed one fixed group during prerelease and a smaller
core group plus independently versioned extensions after 1.0.0. That transition
was not implemented. The repository still has one fixed group, and every current
package manifest carries version `1.2.0`.

A shared version gives maintainers and consumers one release identifier for the
framework, including its optional modules, broker adapters, CLI, catalog generator,
and testing packages. The cost is that an unchanged package can receive a new
version when another member changes. This is an accepted release-policy trade-off.

## Decision

Keep every `@connectum/*` package in the same Changesets fixed group for stable
releases as well as prereleases. Do not introduce a separate independently
versioned extension group.

The versioning configuration remains:

```json
{
  "fixed": [["@connectum/*"]],
  "linked": [],
  "updateInternalDependencies": "patch"
}
```

This excerpt is the version-group policy from `.changeset/config.json`; other
release settings remain in that configuration file. Contributors describe the
packages they changed in a changeset. Changesets determines the shared version
for the group; maintainers do not split package versions by hand.

### Scope

The group includes all framework modules and tools, including
`@connectum/testing` and `@connectum/test-fixtures`. `@connectum/testing` is a
public package (`private: false`), with main and `/parity` exports; it is not an
unpublished exception to this policy.

Package inventories and dependency layers belong in [Packages](/en/packages/)
and [Architecture](/en/guide/production/architecture). A dependency layer does
not define a version group.

### Release identity

The release workflow reads the common version from `packages/core/package.json`
for the framework's `v<version>` GitHub release tag. That file is a representative
of the shared group, not an independently versioned core release.

Release notes should distinguish package-specific behavior changes from version
alignment. A new shared version does not mean that every package's implementation
changed. Consumers still review the migration instructions and dependency ranges
for the modules they install.

## Consequences

### Positive

- One framework version identifies the complete release set.
- Consumers do not need a separately maintained matrix of independent
  Connectum module versions for each release.
- New `@connectum/*` packages belong to the same existing fixed group.
- The existing Changesets configuration and release workflow already implement
  the chosen policy; this revision requires no runtime or release-tool changes.

### Trade-offs

- Packages can receive version bumps for group alignment without code changes.
- Changelogs may include dependency or version-alignment entries.
- Optional modules and tools share the group's release cadence even when their
  implementation could otherwise be released independently.

## Alternatives Considered

| Strategy | Assessment |
|---|---|
| Fixed group for every package -- selected | Preserves one release identity and matches the implemented release configuration. Accepts alignment-only bumps. |
| Hybrid: fixed core, independent extensions -- superseded | Reduces alignment-only bumps but introduces multiple Connectum versions and compatibility coordination. The original post-1.0 transition is cancelled. |
| Fully independent packages -- rejected | Removes the shared framework version and requires compatibility tracking across all modules. |
| Linked groups -- rejected | Linking bump types does not establish the required policy that every package shares one version. |

## References

- [ADR-001: Native TypeScript Migration](./001-native-typescript-migration.md) -- compile-before-publish strategy.
- [ADR-003: Package Decomposition](./003-package-decomposition.md) -- modular package architecture.
- [Changesets fixed packages](https://github.com/changesets/changesets/blob/main/docs/fixed-packages.md).
- [Changesets linked packages](https://github.com/changesets/changesets/blob/main/docs/linked-packages.md).
- [Framework versioning configuration](https://github.com/Connectum-Framework/connectum/blob/main/.changeset/config.json).
- [Release workflow](https://github.com/Connectum-Framework/connectum/blob/main/.github/workflows/release.yml).

## Changelog

| Date | Decision | Change |
|---|---|---|
| 2026-02-20 | Initial ADR | Fixed group during prerelease, with a planned Hybrid transition after 1.0.0. |
| 2026-10-08 | Maintainer revision | Keep all packages at one shared version; cancel the Hybrid transition. Confirm 1.2.0 as the current release and 1.3.0 as the release under review. |

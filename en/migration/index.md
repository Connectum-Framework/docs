---
title: Upgrade and Migration
description: Determine whether a Connectum upgrade requires changes and follow focused migration guides.
docType: migration
---

<script setup>
import site from '../../.vitepress/data/site.json'
</script>

# Upgrade and Migration

The documentation describes the **{{ site.documentedVersion }}** release line. Check every installed
`@connectum/*` version before applying a migration; packages can use different
compatible release lines, so verify the complete set rather than inferring it from
one package.

::: code-group
```bash [npm]
npm ls '@connectum/*'
```

```bash [pnpm]
pnpm list '@connectum/*'
```

```bash [bun]
bun pm ls
```
:::

## Current Release Line

The portal may document the next release line before every package on that line is
published. Use the package-specific [GitHub releases](https://github.com/Connectum-Framework/connectum/releases)
and the [Runtime Compatibility](/en/guide/runtime-compatibility) matrix to decide
whether an upgrade applies to your installed set.

If you are upgrading from a pre-1.0 or 1.0 installation, review every applicable
action below rather than assuming a direct upgrade to the documented line.

## Required Actions by Starting Version

| Installed version | Required action |
|---|---|
| 1.2.x | Review the 1.3 release notes for each installed package and run your existing tests |
| 1.1.x | Review the 1.2 and 1.3 release notes for each installed package and run your existing tests |
| 1.0.x | Review package release notes; 1.1 capabilities are additive |
| RC or alpha | Follow [Migrating to 1.0](/en/migration/1.0), then review the [Service Catalog migration](/en/migration/service-catalog) |

## Focused Migrations

- [Migrating to 1.0](/en/migration/1.0) — Node.js floor, explicit resilience,
  streaming transport validation, and removed EventBus `sync` option.
- [Migrating to the Service Catalog](/en/migration/service-catalog) — replace
  legacy service registration and manual client routing.

## Release History

Full release narratives, pull requests, and package-specific dependency updates
belong in [Connectum GitHub releases](https://github.com/Connectum-Framework/connectum/releases)
and package changelogs. This page keeps only information needed to decide and
complete an upgrade.

## Legacy Anchors

The following aliases preserve links published by the former combined changelog.
They now route readers to the focused migration or public release history.

<span id="v1-1-0"></span>
<span id="breaking-resilience-interceptors-are-now-opt-in-in-createdefaultinterceptors"></span>
<span id="minimum-nodejs-raised-to-22130"></span>
<span id="breaking-connectumcore-validates-streaming-transport-at-startup"></span>
<span id="breaking-publishoptionssync-removed-from-connectumevents"></span>
<span id="rc9-to-rc10"></span>
<span id="rc8-to-rc9"></span>
<span id="rc7-to-rc8"></span>
<span id="rc6-to-rc7"></span>
<span id="rc5-to-rc6"></span>
<span id="rc4-to-rc5"></span>
<span id="rc3-to-rc4"></span>
<span id="breaking-changes-from-alpha"></span>
<span id="key-resolution-priority-change-connectumauth"></span>
<span id="changelog"></span>
<span id="architecture-decision-records"></span>

Continue with [Migrating to 1.0](/en/migration/1.0) for required changes or the
[release history](https://github.com/Connectum-Framework/connectum/releases) for
non-actionable detail.

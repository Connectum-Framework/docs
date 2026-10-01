---
title: Peer Dependencies on protobuf and Connect
description: Keep @bufbuild/protobuf and Connect pins inside the peer ranges Connectum 1.3 declares, and add them yourself on Yarn.
docType: migration
---

# Peer Dependencies on protobuf and Connect

> Applies to 1.3.0.

Starting with 1.3.0, the Connectum runtime packages declare `@bufbuild/protobuf`,
`@connectrpc/connect` and `@connectrpc/connect-node` as **peer dependencies** instead of
regular dependencies. Your application and every Connectum package now share one copy of
each library.

## Does this apply to you?

You need to act if **any** of these is true:

- your `package.json` pins `@bufbuild/protobuf` below `2.16.0`, or `@connectrpc/connect` /
  `@connectrpc/connect-node` below `2.2.0` (or outside the `2.x` line);
- you install with **Yarn**;
- you install with `--legacy-peer-deps` or set `legacy-peer-deps=true` in `.npmrc`.

If you use npm 7 or later, pnpm or Bun, and you either do not pin these libraries or pin
them inside the ranges below, the upgrade needs **no changes**: the package manager
installs the peers and keeps one copy of each.

::: warning Breaking change in a minor release
An installation that worked with 1.2 can fail or warn with 1.3, and an application running
on an out-of-range copy stops at `createServer()`. Under strict Semantic
Versioning this is a major change; it ships in 1.3.0 as an explicit exception to
Connectum's breaking-changes policy, so that applications get the single-copy fix without
waiting for 2.0.
:::

## Why it changed

With regular dependencies, an application that pinned its own version of these libraries
could end up with a **second copy** that no tool reported:

- message and service types generated against one copy of `@bufbuild/protobuf` stopped
  type-checking against the other (`TS2345` / `TS2322` on generated service types);
- `@connectrpc/connect-node` requires one **exact** `@connectrpc/connect` version, so a
  second `connect` next to it formed a pair it does not support.

A peer dependency makes the application's copy the only copy, and makes a version outside
the supported range visible at install time.

## What changed

| Package | Peer dependencies in 1.3.0 |
|---|---|
| `@connectum/core`, `@connectum/testing` | `@bufbuild/protobuf` `^2.16.0`, `@connectrpc/connect` `^2.2.0`, `@connectrpc/connect-node` `^2.2.0` |
| `@connectum/auth`, `@connectum/events`, `@connectum/interceptors`, `@connectum/healthcheck`, `@connectum/reflection` | `@connectum/core`, `@bufbuild/protobuf` `^2.16.0`, `@connectrpc/connect` `^2.2.0` |
| `@connectum/otel`, `@connectum/test-fixtures` | `@bufbuild/protobuf` `^2.16.0`, `@connectrpc/connect` `^2.2.0` |

- `@connectum/auth`, `@connectum/events` and `@connectum/interceptors` now take
  `@connectum/core` as a peer dependency, so they use your application's
  `@connectum/core` rather than a copy of their own.
- `@connectum/interceptors` depends on `@bufbuild/protovalidate` directly, so the
  validation engine is installed with it on every package manager.
- `@connectum/cli` and `@connectum/protoc-gen-catalog` are unchanged. They are
  executables that run at build time and keep their own copies, because
  `@bufbuild/protoplugin` pins `@bufbuild/protobuf` exactly; the single-copy guarantee
  does not cover them.

## What your package manager does

| Situation | npm 7+ | pnpm | Bun |
|---|---|---|---|
| Libraries not listed in your `package.json` | installed automatically | installed automatically | installed automatically |
| Pins inside the ranges | one shared copy | one shared copy | one shared copy |
| Pin below the range | install **fails**: `ERESOLVE unable to resolve dependency tree` | installs your copy and prints `Issues with peer dependencies found`; `pnpm peers check` lists `unmet peer <library>` | installs your copy and prints `warn: incorrect peer dependency "<library>@<version>"` — but see the note below |

Yarn does not install missing peer dependencies. See [Required changes](#required-changes).

::: warning Bun can stay silent about an old `@bufbuild/protobuf`
When your project also contains a tool that brings its own in-range `@bufbuild/protobuf`
— `@bufbuild/protoc-gen-es` and `@connectum/protoc-gen-catalog` both do — Bun 1.4 installs
a too-old `@bufbuild/protobuf` pin **without a warning**. The startup check below catches it.
:::

## What happens at startup

Whatever installed your dependencies, `createServer()` checks the `@bufbuild/protobuf`,
`@connectrpc/connect` and `@connectrpc/connect-node` that `@connectum/core` actually
loaded. If one is outside the range above, the server is not created and
`PeerDependencyVersionError` (exported from `@connectum/core`) is thrown:

```text
PeerDependencyVersionError: @connectum/core loaded peer libraries outside its supported range:
  - @bufbuild/protobuf: loaded 2.12.1 (from /app/node_modules/@bufbuild/protobuf), @connectum/core requires ^2.16.0
Generated code and the framework must share one in-range copy of each library; an older copy breaks generated types and Connect at runtime.
Fix: raise your pins to the required ranges (npm install @bufbuild/protobuf@"^2.16.0", or the pnpm / bun / yarn equivalent), or force one in-range version with "overrides" (npm, Bun), pnpm "overrides" or Yarn "resolutions", then reinstall.
```

The check has no switch to turn the failure into a warning: an out-of-range copy breaks
generated types and Connect at runtime.

It is **skipped** when the loaded versions cannot be determined:

- `@connectum/core` is bundled into your application (esbuild, `bun build`, and similar) —
  a bundle has no package metadata left to read;
- the runtime has no `import.meta.resolve`.

In those setups the install-time behavior above is your only signal, so keep the pins in
range.

::: info One known exception to the single copy
`@connectum/reflection` currently uses `@lambdalisue/connectrpc-grpcreflect`, which lists
`@bufbuild/protobuf` and `@connectrpc/connect` as regular dependencies, so a package
manager may give it a copy of its own. This goes away when Connectum ships its own gRPC
Server Reflection.
:::

## Required changes

1. **Bring your pins into range, or drop them.** Raise `@bufbuild/protobuf` to `^2.16.0`
   and `@connectrpc/connect` / `@connectrpc/connect-node` to `^2.2.0`, keeping `connect`
   and `connect-node` on the **same** version. Alternatively, remove the pins and let
   npm, pnpm or Bun install the peers.
2. **Regenerate code** with `@bufbuild/protoc-gen-es` 2.16 or later, so generated code
   matches the runtime.
3. **On Yarn, declare the libraries yourself**, together with `@connectum/core` when you
   use `@connectum/auth`, `@connectum/events` or `@connectum/interceptors`.
4. **Do not bypass a conflict** with `--legacy-peer-deps` or `--force`: that puts the
   second copy back.

## Before and after

**Before** — a pin below the range, accepted silently by 1.2:

```json
{
  "dependencies": {
    "@bufbuild/protobuf": "2.12.1",
    "@connectrpc/connect": "2.1.2",
    "@connectum/core": "^1.2.0"
  }
}
```

**After** — pins inside the ranges, `connect` and `connect-node` on the same version:

```json
{
  "dependencies": {
    "@bufbuild/protobuf": "^2.16.0",
    "@connectrpc/connect": "^2.2.0",
    "@connectrpc/connect-node": "^2.2.0",
    "@connectum/core": "^1.3.0"
  }
}
```

On Yarn, install them explicitly:

```bash
yarn add @connectum/core @bufbuild/protobuf @connectrpc/connect @connectrpc/connect-node
```

## Verify the upgrade

Each library must appear **once**, and `connect` must equal the version `connect-node`
requires:

::: code-group
```bash [npm]
npm ls @bufbuild/protobuf @connectrpc/connect @connectrpc/connect-node
```

```bash [pnpm]
pnpm why @bufbuild/protobuf
pnpm peers check
```

```bash [bun]
bun pm ls --all | grep -E '@bufbuild/protobuf@|@connectrpc/connect(-node)?@'
```
:::

`npm ls` exits non-zero and marks an entry `invalid` when a peer range is not met.
`pnpm peers check` must not list `@bufbuild/protobuf`, `@connectrpc/connect` or
`@connectrpc/connect-node`. With Bun, a second version of `@bufbuild/protobuf` nested under
`@bufbuild/protoplugin` belongs to the code generator and is expected, and so is one under
`@lambdalisue/connectrpc-grpcreflect` (the known exception above); any other second
version is not. Then start the service: `createServer()` must not throw
`PeerDependencyVersionError`. Finally, run your type-check and tests.

## Related release notes

- [`@connectum/core` releases](https://github.com/Connectum-Framework/connectum/releases)
- [Runtime Compatibility](/en/guide/runtime-compatibility)

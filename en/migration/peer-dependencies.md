---
title: Peer Dependencies on protobuf and Connect
description: Keep @bufbuild/protobuf and Connect pins inside the peer ranges Connectum 1.3 declares.
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
| Pin below the range | install **fails**: `ERESOLVE unable to resolve dependency tree` | installs your copy and prints `Issues with peer dependencies found`; `pnpm peers check` lists `unmet peer <library>` | installs your copy and, in the setups tested with Bun 1.4.4, prints **no warning** — see the note below |

::: warning Bun does not warn about a pin below the range
Bun 1.4.4 installed a pin below the range without any warning in every setup tried: a
too-old `@bufbuild/protobuf` next to `@connectum/core`, the same setup with
`@bufbuild/protoc-gen-es` added, and a `@connectrpc/connect` older than the one
`@connectrpc/connect-node` requires, with no Connectum package at all. Do not rely on Bun's
install output; the startup check below is what stops such an installation.
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
Fix: raise your pins to the required ranges (npm install @bufbuild/protobuf@"^2.16.0", or the pnpm / bun equivalent), or force one in-range version with "overrides" (npm, Bun) or pnpm "overrides", then reinstall.
```

Lockstep is checked at startup too. `@connectrpc/connect-node` works only with the exact
`@connectrpc/connect` version it declares, so the check also fails when the `connect`
that connect-node loads is another version, or a different copy than the one
`@connectum/core` loads — a pair Bun installs without complaint:

```text
  - @connectrpc/connect: loaded 2.2.0 (from /app/node_modules/@connectrpc/connect), @connectrpc/connect-node@2.1.2 requires 2.1.2
@connectrpc/connect-node works only with the exact @connectrpc/connect version it declares: keep both on the same version, with a single copy.
```

The check has no switch to turn the failure into a warning: an out-of-range copy breaks
generated types and Connect at runtime.

The check understands only an exact version or a caret range `^X.Y.Z` with `X` of 1 or
higher. A peer range in any other form, such as `>=2.2.0` or `^0.2.0`, cannot be
evaluated: that library is treated as passing, and no error is reported for it.

It is **skipped** when the loaded versions cannot be determined:

- `@connectum/core` is bundled into your application (esbuild, `bun build`, and similar) —
  a bundle has no package metadata left to read;
- the runtime has no `import.meta.resolve`.

In those setups the install-time behavior above is your only signal, so keep the pins in
range.

## Required changes

1. **Bring your pins into range, or drop them.** Raise `@bufbuild/protobuf` to `^2.16.0`
   and `@connectrpc/connect` / `@connectrpc/connect-node` to `^2.2.0`, keeping `connect`
   and `connect-node` on the **same** version. Alternatively, remove the pins and let
   npm, pnpm or Bun install the peers.
2. **Regenerate code** with `@bufbuild/protoc-gen-es` 2.16 or later, so generated code
   matches the runtime.
3. **Do not bypass a conflict** with `--legacy-peer-deps` or `--force`: that puts the
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

## Verify the upgrade

Each library must appear **once** across your application and the runtime `@connectum/*`
packages, and `connect` must equal the version `connect-node` requires. Copies nested
under `@connectum/cli` or `@connectum/protoc-gen-catalog` are expected: those are
executables, and the code generator pins its own `@bufbuild/protobuf`. They do not count
as violations:

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
`@bufbuild/protoplugin` belongs to the code generator and is expected; any other second
version is not. Then start the service: `createServer()` must not throw
`PeerDependencyVersionError`. Finally, run your type-check and tests.

## Related release notes

- [`@connectum/core` releases](https://github.com/Connectum-Framework/connectum/releases)
- [Runtime Compatibility](/en/guide/runtime-compatibility)

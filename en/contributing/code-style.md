---
title: Code Style
description: What Biome and the TypeScript compiler enforce in the Connectum framework repository, and which conventions are only habits.
docType: contributor-guide
---

# Code Style

This page separates what a tool checks for you from what is a convention that
reviewers expect. A rule that a tool enforces fails `pnpm lint`, `pnpm lint:repo`, or
`pnpm typecheck`; a convention is marked as such.

## Tools

| Tool | Configuration | Run with |
|---|---|---|
| [Biome](https://biomejs.dev/) formatter, linter and import organizer | `biome.json` | `pnpm lint` (each package's `src`), `pnpm lint:repo` (whole repository), `pnpm format` (rewrite each package's `src`) |
| TypeScript compiler, type checking only | `tsconfig.json` | `pnpm typecheck` |

The [pre-commit hook](/en/contributing/pull-requests) runs `biome check --write` over
the whole repository, so formatting and import order are fixed for you when you commit.
Warnings count as failures: both lint commands pass `--error-on-warnings`.

## Formatting

Biome formats the source: four-space indentation, a line width of 180 characters,
semicolons, and double quotes. Do not format by hand and do not argue with the
formatter; run `pnpm format`.

Test files (`*.test.*`) are excluded from Biome's formatter and linter. Match the
style of the surrounding tests.

## TypeScript

Source runs as TypeScript directly during development and is compiled before it is
published, so it is limited to syntax that can be erased. `tsconfig.json` enforces
this:

- `erasableSyntaxOnly`: no `enum`, no `namespace` that contains runtime code, no
  constructor parameter properties.
- `verbatimModuleSyntax`: a type-only import must be written `import type`.
- `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noUnusedLocals`,
  and `noUnusedParameters` are on.

Use a `const` object with `as const` where you would have used an `enum`, and derive the
type from it with the same name. From `packages/core/src/types.ts`:

```typescript
export const ServerState = {
    /** Server created but not started */
    CREATED: "created",
    RUNNING: "running",
    STOPPED: "stopped",
} as const;

export type ServerState = (typeof ServerState)[keyof typeof ServerState];
```

(The real definition has two more states; the example is shortened.)

## Imports

### Extensions

Relative imports in source name the real file, including the `.ts` extension:

```typescript
import { createServer } from "./Server.ts";
import type { Server } from "./types.ts";
```

`tsconfig.json` allows this with `allowImportingTsExtensions` and
`rewriteRelativeImportExtensions`. Biome's `useImportExtensions` rule is a warning
for the repository as a whole and is turned off for `packages/*/src`
(an override in `biome.json`), so scripts and fixtures outside package sources are held to it.
The published packages are bundled by tsup, so the compiled `dist/` imports its own
`.js` chunks; the `.ts` specifiers exist only in source.

### Order

Biome's import organizer sorts imports and exports, and `biome check` reports an
unsorted file as an error. The groups, in order:

1. `node:` built-ins
2. packages, with scoped packages and workspace packages (`@connectum/*`) sorted among
   the other external packages
3. relative imports, parent directories before the current directory

`import type` is not a separate group: it sits where the module sits. Named
specifiers inside braces are sorted too. A typical header:

```typescript
import assert from "node:assert";
import { setTimeout } from "node:timers/promises";
import type { Interceptor } from "@connectrpc/connect";
import { createServer } from "@connectum/core";
import { z } from "zod";
import { helper } from "../helper.ts";
import type { Options } from "./types.ts";
```

Do not sort by hand. `pnpm format` or the pre-commit hook does it.

### Other import rules

Biome fails the lint on a few import patterns, all set in `biome.json`:

- `export *` re-exports (`noReExportAll`): export names explicitly.
- Namespace imports (`noNamespaceImport`): `import * as x from "..."`.
- Import cycles (`noImportCycles`).
- Importing a symbol that is marked private in its package (`noPrivateImports`).

A custom rule also forbids `createRouterTransport` from `@connectrpc/connect` in
package sources, because a router transport built that way skips the server
interceptors. Use `createLocalTransport` from `@connectum/core`
(`lint/no-direct-router-transport.grit`).

## Names

These are conventions; no tool checks them.

- Classes, types, interfaces, and the `const` objects that replace enums use
  `PascalCase`. Functions, variables, and parameters use `camelCase`.
- Prefer one options object over several positional parameters when a function takes
  optional configuration:

  ```typescript
  async function sleep(options: { interval: number; multiplier?: number }): Promise<void>;
  ```

- File names are not uniform across the repository, so follow the package you are
  editing. A file that exports one class is usually named after it in `PascalCase`
  (`Server.ts`, `ShutdownManager.ts`, `KafkaAdapter.ts`). Other files in most packages
  use `camelCase` (`enabledServices.ts`, `gracefulShutdown.ts`); `@connectum/auth`,
  `@connectum/interceptors`, `@connectum/otel`, `@connectum/testing`, and
  `@connectum/test-fixtures` have files in `kebab-case` (`jwt-auth-interceptor.ts`,
  `circuit-breaker.ts`). `index.ts` is the package entry point.

## Documentation comments

Public symbols carry JSDoc, and the generated
[API reference](/en/api/) is built from it. The style, taken from
`packages/core/src/enabledServices.ts`:

```typescript
/**
 * Read `enabledServices` from a comma-separated env value, in one line.
 *
 * To mount none of the supplied services, pass `enabledServices: []` directly; an env
 * value cannot ask for that. Use full proto `typeName`s, as for {@link parseServicesEnv}.
 *
 * @example
 * ```ts
 * import { createServer, enabledServicesFromEnv } from "@connectum/core";
 *
 * const server = createServer({
 *   services: [greeterService],
 *   enabledServices: enabledServicesFromEnv(process.env.CONNECTUM_SERVICES),
 * });
 * ```
 */
export function enabledServicesFromEnv(value: string | undefined | null): string[] | undefined {
```

- Start with one sentence that says what the symbol does for the caller.
- Explain behavior a reader would otherwise get wrong: the default, the edge case, the
  reason for a restriction. Do not restate the signature.
- Add an `@example` with imports that match the public package name.
- Link related symbols with `{@link}`. The TypeDoc run in CI treats every warning as an
  error, so a link to a symbol that does not exist, or a public signature that names a type
  the reference cannot show, fails the build.
- A file that opens a module can start with a block comment ending in `@module`, as
  `enabledServices.ts` does.
- A comment inside code explains why the code is the way it is, not what it does. This
  is a convention, not a rule a tool checks; `packages/core/src/enabledServices.ts` and
  its test file are good models.

When you change a symbol's behavior, update its JSDoc in the same change; see
[Documentation Style Guide](/en/contributing/documentation-style) for the rest of the
documentation that moves with code.

## Related

- [Pull Requests](/en/contributing/pull-requests)
- [Commit Messages](/en/contributing/commit-messages)
- [Testing the Framework](/en/contributing/testing)

---
title: TypeScript Execution Models
description: Choose native Node.js, Bun, or tsx for application TypeScript without duplicating the runtime support matrix.
docType: concept
outline: deep
---

# TypeScript Execution Models

All `@connectum/*` packages ship compiled ESM JavaScript, declarations, and source
maps. Your application can therefore choose how to execute its own TypeScript
without loading Connectum through a custom register hook.

For supported versions, feature coverage, and known limitations, use the
canonical [Runtime Compatibility](/en/guide/runtime-compatibility) matrix.

## Native Node.js Type Stripping

The current development baseline can execute erasable TypeScript directly:

```bash
node src/index.ts
node --watch src/index.ts
```

This path requires the syntax and import rules in [Erasable Syntax](/en/guide/typescript/erasable-syntax).
`tsc --noEmit` still performs type checking; Node.js removes types but does not
type-check the program.

## Bun

Bun can execute the same application sources directly:

```bash
bun src/index.ts
bun --watch src/index.ts
```

Use runtime variants in task guides where a command or limitation genuinely
differs. Do not assume Node.js-only OpenTelemetry auto-instrumentation works under
Bun; check [Runtime Compatibility](/en/guide/runtime-compatibility#otel).

## tsx on the Consumer Node.js Line

Applications on the supported consumer Node.js line can execute TypeScript with
tsx instead of relying on native type stripping:

```bash
npx tsx src/index.ts
npx tsx watch src/index.ts
```

Install `tsx` as a development dependency for repeatable project scripts. This
choice changes how application source is executed; it does not change the
compiled format of Connectum packages.

## Choose an Execution Model

| Need | Use |
|---|---|
| Match Connectum's native-TypeScript development workflow | Native Node.js type stripping |
| Run and test the application on Bun | Bun, after checking the compatibility matrix |
| Stay on the consumer Node.js line while executing TypeScript source | tsx |
| Publish a compiled application artifact | Your normal ESM build pipeline |

Generated import extensions must match the project's `buf.gen.yaml` and execution
model. The Quickstart executes generated TypeScript directly and therefore uses
`.ts`; compiled distributions normally generate imports for their emitted `.js`.

## Related

- [Runtime Compatibility](/en/guide/runtime-compatibility) — supported versions and limitations
- [Erasable Syntax](/en/guide/typescript/erasable-syntax) — native type-stripping constraints
- [Proto Enums](/en/guide/typescript/proto-enums) — generation when enums require transformation
- [Patterns and Workflow](/en/guide/typescript/patterns) — project conventions

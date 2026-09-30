---
title: Erasable Proto Enums
description: Adopt erasable_syntax=true in a project generated before it, and update code that relied on TypeScript enum behavior.
docType: migration
---

# Erasable Proto Enums

> Applies to projects whose `buf.gen.yaml` does not pass `erasable_syntax=true` to
> `protoc-gen-es` — for example, projects copied from the `getting-started` example
> before it adopted the option. Projects created with `connectum init` from 1.3.0 on
> already have it.

## Does this apply to you?

Only if **both** hold:

- your protos declare at least one `enum`; and
- you add `erasable_syntax=true` to an existing project, or regenerate code from a
  newer `getting-started` or `connectum init` that sets it.

Projects that run on Node.js with native type stripping could not run generated
TypeScript enums at all (`ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`, and `TS1294` in
`typecheck`), so for them this is a fix, not a behavior change. Projects that run on Bun
or tsx executed the enums and may have code that relies on `enum` behavior — review the
changes below. Projects without enums need no changes.

## Required changes

1. Raise `@bufbuild/protobuf` (dependencies) and `@bufbuild/protoc-gen-es`
   (devDependencies) to `^2.16.0`. The option first ships in `protoc-gen-es` 2.13.0,
   and the generated code imports `UnknownEnum` from `@bufbuild/protobuf` 2.13.0 or
   later; `^2.16.0` is what the Connectum scaffold uses.
2. Add `erasable_syntax=true` to the `protoc-gen-es` options in `buf.gen.yaml` — not
   to other plugins; Connectum's catalog plugin rejects unknown options.
3. Run `buf generate`, then fix the code the type checker flags:
   - reverse lookups (`Status[value]`) — use the descriptor instead:
     `StatusSchema.value[value]?.localName`;
   - the type of a single member (`Status.ACTIVE` in a type position) — write
     `typeof Status.ACTIVE`;
   - functions that take an open enum and assume a declared value — handle
     `UnknownEnum` (for example with `isUnknownEnum` from `@bufbuild/protobuf`).

## Before and after

```typescript
// Before: TypeScript enum
export enum Status { UNSPECIFIED = 0, ACTIVE = 1 }
const label = Status[msg.status];            // "ACTIVE"
function isActive(s: Status.ACTIVE) {}

// After: erasable_syntax=true
export const Status = { UNSPECIFIED: 0, ACTIVE: 1 } as const;
export type Status = (typeof Status)[keyof typeof Status] | UnknownEnum;
const label = StatusSchema.value[msg.status]?.localName; // "ACTIVE"
function isActive(s: typeof Status.ACTIVE) {}
```

## Verify the upgrade

1. `grep -rn "export enum" gen/` finds nothing.
2. `typecheck` passes with `erasableSyntaxOnly: true`.
3. On Node.js, `node src/index.ts` starts without `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`,
   and your tests pass.

## Related release notes

- [Proto Enums](/en/guide/typescript/proto-enums) — the generated shape in full
- [Scaffolding: enums in generated code](/en/guide/scaffolding#enums-in-generated-code)
- [Connectum GitHub releases](https://github.com/Connectum-Framework/connectum/releases)

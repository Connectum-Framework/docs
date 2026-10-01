---
title: Proto Enums
description: Generate Protobuf enums that run under Node.js native type stripping and erasableSyntaxOnly.
docType: how-to
outline: deep
---

# Proto Enums

Protobuf enums are common in `.proto` files. By default `protoc-gen-es` turns each one
into a TypeScript `enum`, which Node.js native type stripping cannot execute and
`erasableSyntaxOnly` rejects. This page shows how to generate erasable enums instead,
and what changes in the code that uses them.

## The Problem

```protobuf
// In your .proto file
enum OrderStatus {
  ORDER_STATUS_UNSPECIFIED = 0;
  ORDER_STATUS_PENDING = 1;
  ORDER_STATUS_SHIPPED = 2;
}
```

With default options, `protoc-gen-es` generates:

```typescript
// Generated code -- NOT erasable
export enum OrderStatus {
  UNSPECIFIED = 0,
  PENDING = 1,
  SHIPPED = 2,
}
```

`enum` produces runtime code, so it is not erasable syntax:

- `node src/index.ts` fails with `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX: TypeScript enum is not supported in strip-only mode`;
- `tsc` with `erasableSyntaxOnly: true` reports `TS1294: This syntax is not allowed when 'erasableSyntaxOnly' is enabled`.

Bun and tsx transpile TypeScript instead of stripping it, so they execute the `enum`;
the type check still fails under `erasableSyntaxOnly`.

## Generate erasable enums

### Before you begin

- `@bufbuild/protoc-gen-es` **2.13.0 or later**: the `erasable_syntax` option first
  ships in that release.
- `@bufbuild/protobuf` **2.13.0 or later**: the generated code imports its
  `UnknownEnum` type.

Connectum's scaffold and the `getting-started` example declare `^2.16.0` for both.

### Configure `buf.gen.yaml`

Add `erasable_syntax=true` to the `protoc-gen-es` options:

```yaml
version: v2
plugins:
  - local: protoc-gen-es
    out: gen
    opt:
      - target=ts
      - import_extension=.ts
      - erasable_syntax=true
```

Pass the option to `protoc-gen-es` only. Other plugins in the same file do not
necessarily accept it: Connectum's catalog plugin (`protoc-gen-connectum-catalog`)
rejects every option except `output_file`.

Upstream `protoc-gen-es` labels the option **experimental**; see its
[plugin options](https://github.com/bufbuild/protobuf-es/blob/main/packages/protoc-gen-es/README.md#plugin-options).

### What gets generated

Each enum becomes an object with `as const` and a type with the same name:

```typescript
export const OrderStatus = {
  UNSPECIFIED: 0,
  PENDING: 1,
  SHIPPED: 2,
} as const;

export type OrderStatus = (typeof OrderStatus)[keyof typeof OrderStatus] | UnknownEnum;
```

An enum nested in a message keeps its generated name, for example `Order_Status`.

### Using the enum

| You write | With a TypeScript `enum` | With `erasable_syntax=true` |
|---|---|---|
| `OrderStatus.PENDING` | `1` | `1` — unchanged |
| `OrderStatus[1]` (reverse lookup) | `"PENDING"` | `undefined`, and a type error |
| `OrderStatus` in a type position | the enum type | the union of its values (plus `UnknownEnum` for an open enum) |
| The type of one value | `OrderStatus.PENDING` | `typeof OrderStatus.PENDING` |
| `Object.keys(OrderStatus)` | names **and** numeric keys | names only |

- **Open enums.** A proto3 enum is open: it can carry numbers the schema does not
  declare, so its type is a union with `UnknownEnum`. A closed enum (proto2, or the
  `CLOSED` editions feature) is the union of its values only.
- **Names from numbers.** Instead of the reverse mapping, read the generated enum
  descriptor: `OrderStatusSchema.value[1]?.localName` is `"PENDING"`, and `.name` is
  the name from the proto source, `"ORDER_STATUS_PENDING"`.
- **Exhaustive `switch`.** Rule out unknown values first with `isUnknownEnum` from
  `@bufbuild/protobuf`, then switch over the known members.

### Verify

1. Run `buf generate`. The header of each generated file names the options, for
   example `parameter "target=ts,import_extension=.ts,erasable_syntax=true"`.
2. `grep -rn "export enum" gen/` finds nothing.
3. `tsc --noEmit` passes with `erasableSyntaxOnly: true`, and
   `node src/index.ts` starts without `ERR_UNSUPPORTED_TYPESCRIPT_SYNTAX`.

## Projects created by `connectum init` {#scaffolded-projects}

A project scaffolded with `connectum init` is already configured this way: the
generated `buf.gen.yaml` passes `erasable_syntax=true` to `protoc-gen-es`, and the
scaffold declares `@bufbuild/protobuf` and `@bufbuild/protoc-gen-es` at `^2.16.0` or
higher, including when you fetch an older base with `--ref`. See
[Scaffolding a New Service](/en/guide/scaffolding#enums-in-generated-code).

## The Two-Step Workaround

Only needed when you cannot move to `protoc-gen-es` 2.13.0 or later: generate the
TypeScript into a temporary directory and compile it to JavaScript, which Node.js
runs without type stripping.

1. Generate TypeScript to a temporary directory (`gen-ts/`)
2. Compile with `tsc` to produce JavaScript in `gen/`

```json
{
  "scripts": {
    "build:proto": "protoc -I proto --plugin=protoc-gen-es=./node_modules/.bin/protoc-gen-es --es_out=gen-ts --es_opt=target=ts proto/*.proto",
    "build:proto:compile": "tsc -p tsconfig.gen.json",
    "build:proto:all": "pnpm build:proto && pnpm build:proto:compile"
  }
}
```

Create `tsconfig.gen.json` for the compilation step:

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "nodenext",
    "moduleResolution": "nodenext",
    "declaration": true,
    "outDir": "gen",
    "rootDir": "gen-ts"
  },
  "include": ["gen-ts/**/*.ts"]
}
```

## Related

- [TypeScript Overview](/en/guide/typescript) -- back to overview
- [Erasable Syntax](/en/guide/typescript/erasable-syntax) -- why enums are not allowed
- [Patterns & Workflow](/en/guide/typescript/patterns) -- const objects pattern
- [Erasable enums migration](/en/migration/erasable-enums) -- adopting the option in an existing project
- [protobuf-es: Enums vs Objects](https://github.com/bufbuild/protobuf-es/blob/main/docs/src/content/docs/reference/generated-code/index.md#enums-vs-objects) -- upstream reference

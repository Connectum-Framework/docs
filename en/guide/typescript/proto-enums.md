---
outline: deep
---

# Proto Enums

Proto files commonly use `enum`, which generates non-erasable TypeScript. This page describes the workaround and alternatives.

## The Problem

`protoc-gen-es` generates TypeScript `enum` declarations for proto enums:

```protobuf
// In your .proto file
enum OrderStatus {
  ORDER_STATUS_UNSPECIFIED = 0;
  ORDER_STATUS_PENDING = 1;
  ORDER_STATUS_SHIPPED = 2;
}
```

This generates:

```typescript
// Generated code -- NOT erasable
export enum OrderStatus {
  UNSPECIFIED = 0,
  PENDING = 1,
  SHIPPED = 2,
}
```

Node.js cannot execute this directly because `enum` generates runtime code.

## The Two-Step Workaround

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

## Avoiding the Workaround

If you control your proto definitions, you can avoid `enum` entirely:

```protobuf
// Instead of enum, use int32 constants
message Order {
  int32 status = 1;
  // Constants defined in documentation:
  // 0 = UNSPECIFIED
  // 1 = PENDING
  // 2 = SHIPPED
}
```

Then define constants in TypeScript:

```typescript
const OrderStatus = {
  UNSPECIFIED: 0,
  PENDING: 1,
  SHIPPED: 2,
} as const;

type OrderStatus = typeof OrderStatus[keyof typeof OrderStatus];
```

::: info Future improvement
This workaround is temporary. When Node.js adds native `enum` support (or `protoc-gen-es` offers an option to generate `as const` objects), the two-step process will no longer be needed.
:::

## Related

- [TypeScript Overview](/en/guide/typescript) -- back to overview
- [Erasable Syntax](/en/guide/typescript/erasable-syntax) -- why enums are not allowed
- [Patterns & Workflow](/en/guide/typescript/patterns) -- const objects pattern

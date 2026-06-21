---
title: '@connectum/protoc-gen-catalog'
description: Buf/protoc plugin that generates the typed Connectum service catalog
---

# @connectum/protoc-gen-catalog

A Buf/protoc plugin that generates a **Connectum service catalog** from your
proto files. The generated `catalog.gen.ts` is what makes `ctx.call`,
`ctx.stream`, and `createCatalogClient` (from `@connectum/core`) fully typed.

**Layer**: 2 (Codegen tooling)

::: tip Related Guides
- [Service Catalog](/en/guide/service-communication/service-catalog) -- declarative cross-service calls
- [Resolvers](/en/guide/service-communication/resolvers) -- routing catalog calls to transports
:::

## Installation

```bash
pnpm add -D @connectum/protoc-gen-catalog
```

**Requires**: Node.js 22.13+

It is a build-time `buf` plugin (binary: `protoc-gen-connectum-catalog`); it is
not imported at runtime.

## What it generates

One `catalog.gen.ts` per buf module, containing:

- a runtime `serviceCatalog` object keyed by proto `typeName` — pass it to
  `createServer({ catalog: serviceCatalog })` or `createCatalogClient({ catalog: serviceCatalog })`;
- module augmentation of `@connectum/core`'s `ConnectumCallMap` (unary methods)
  and `ConnectumStreamMap` (streaming methods), typing every `ctx.call` /
  `ctx.stream` key.

```ts
// catalog.gen.ts (generated — DO NOT EDIT)
import type {} from "@connectum/core";
import { GreeterService } from "./greeter_pb.js";
import type { SayHelloRequest, SayHelloResponse } from "./greeter_pb.js";

export const serviceCatalog = {
    "greeter.v1.GreeterService": GreeterService,
} as const;

declare module "@connectum/core" {
    interface ConnectumCallMap {
        "greeter.v1.GreeterService/SayHello": { request: SayHelloRequest; response: SayHelloResponse };
    }
    interface ConnectumStreamMap {}
}
```

## Usage (`buf.gen.yaml`)

```yaml
version: v2
plugins:
  - local: protoc-gen-es
    out: gen
    opt: [target=ts, import_extension=.js]
  - local: protoc-gen-connectum-catalog
    strategy: all
    out: gen
    opt: [target=ts, import_extension=.js]
```

`strategy: all` is **required**. The catalog aggregates every service into a
single `catalog.gen.ts`, so buf must invoke the plugin once over all files. With
the default `directory` strategy, buf runs the plugin once per proto directory
and emits a duplicate `catalog.gen.ts` — keeping only one directory's services.

Generate it alongside `protoc-gen-es` with the **same `import_extension`** so the
catalog's imports match the protobuf-es output:

- `import_extension=.js` — recommended (pre-compiled distribution: tsup → `.js` + `.d.ts`).
- `import_extension=.ts` — raw-source distribution (Bun / Node strip-types). Use
  only if you ship `.ts` and your `tsconfig` allows it.

### Options

| Option | Default | Description |
|--------|---------|-------------|
| `output_file` | `catalog.gen.ts` | Output file name, relative to the output root. Absolute paths and `..` traversal are rejected. |

## Important

- The generated file **must** be loaded by your contracts package — re-export it
  from `index.ts` or add a top-level `import "./catalog.gen.ts";`. Without it,
  consumers silently see missing `ConnectumCallMap` keys.
- The `import type {} from "@connectum/core";` line is required for the
  augmentation to merge in cross-package builds (avoids `TS2664`). Do not remove it.
- The plugin generates services from **files-to-generate** only, not from the
  transitive proto import graph.

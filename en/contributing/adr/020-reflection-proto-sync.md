# ADR-020: Reflection-based Proto Synchronization

**Status:** Accepted - 2026-02-11 (Phase 1 DONE, Phase 2 DONE)

**Deciders:** Tech Lead, Platform Team

**Tags:** `protobuf`, `reflection`, `proto-sync`, `cli`, `code-generation`, `openapi`, `npm`, `buf`, `grpcurl`

**Related:** Extends [ADR-009: Buf CLI Migration](./009-buf-cli-migration.md), uses [ADR-003: Package Decomposition](./003-package-decomposition.md) (@connectum/proto -- package since removed, see ADR-003 update notes).

---

## Context

### Problem: proto synchronization between server and client

A key challenge with protobuf is distributing proto definitions and generated types between a server and its clients. Currently, clients of Connectum services have no standard way to obtain proto files or generated TypeScript types.

### Current State

#### 1. Reflection Server (incomplete)

The file `packages/core/src/protocols/reflection/withReflection.ts` implements `grpc.reflection.v1.ServerReflection` (bidirectional streaming), but with critical TODOs:

```typescript
// withReflection.ts -- current implementation (BROKEN)
// fileByFilename and fileContainingSymbol return EMPTY descriptors:
fileDescriptorProto: [], // TODO: Serialize file descriptors (lines 95, 117)
```

This means `grpcurl`, `buf curl`, Postman, and any reflection-based tools cannot obtain schema from a Connectum server.

#### 2. Ready-made solution in the ConnectRPC ecosystem

The package [`@lambdalisue/connectrpc-grpcreflect`](https://www.npmjs.com/package/@lambdalisue/connectrpc-grpcreflect) provides a **complete implementation** of the gRPC Server Reflection Protocol for ConnectRPC:

- **Server-side**: `registerServerReflectionFromFileDescriptorSet()` -- registers reflection v1 + v1alpha on ConnectRouter
- **Client-side**: `ServerReflectionClient` -- service discovery, FileDescriptorProto download, `buildFileRegistry()`
- **Dependencies**: `@bufbuild/protobuf` ^2.10.1, `@connectrpc/connect` ^2.1.1 -- **exact match** with Connectum
- **License**: MIT, 115 passing tests, active development

#### 3. @connectum/proto package (Layer 0) [Update: REMOVED, see ADR-003]

> **Update (2026-02-12):** The `@connectum/proto` package has been removed from the monorepo. The description below is preserved for historical context.

The package already contained proto definitions and generated types, but was not published to npm.

> **Note**: gRPC Health Check and Reflection protos were removed from `@connectum/proto`. Health proto moved to `@connectum/healthcheck`, Reflection uses `@lambdalisue/connectrpc-grpcreflect`. WKT (`google/protobuf/*`) remain as build-time dependencies but are not exported (available from `@bufbuild/protobuf`).

#### 4. Dependencies

- `@bufbuild/protobuf` v2.10.2 -- contains `toBinary()`, `createFileRegistry()`, `FileDescriptorProtoSchema`
- `@connectrpc/connect` v2.1.1 -- ConnectRPC framework
- `@bufbuild/buf` -- Buf CLI v2 for code generation ([ADR-009](./009-buf-cli-migration.md))
- `@lambdalisue/connectrpc-grpcreflect` -- ConnectRPC-native reflection (server + client), compatible with `@bufbuild/protobuf` ^2.10.1

### Requirements

1. **Standard way to obtain types**: Clients of Connectum services should get TypeScript types without manually copying proto files
2. **Working reflection**: grpcurl, buf curl, Postman should get full schema from dev/staging server
3. **Dev convenience**: Single command to sync types with a running server
4. **Security**: Reflection should not be enabled in production by default
5. **Use existing tools**: Minimum custom code, maximum existing npm packages and buf CLI

---

## Decision

**Implement a phased proto synchronization strategy in 4 phases: npm publish (Phase 0), reflection server replacement (Phase 1), reflection CLI (Phase 2), OpenAPI generation (Phase 3).**

### Strategy: simple to complex

> **Update (2026-02-12):** The original insight below has been revised. `@connectum/proto` was removed; instead of npm publish, proto distribution is handled via BSR deps + `buf.lock` and `@connectum/cli proto sync` (Phase 2). Phase 1 and Phase 2 remain the primary mechanisms.

Current insight -- **proto distribution is solved by two mechanisms**: (1) BSR deps in `buf.yaml` for third-party proto definitions; (2) `@connectum/cli proto sync` for obtaining types from a running server via gRPC Reflection.

### Phase 0: BSR deps approach (v0.2.0) -- REVISED

> **Update (2026-02-12): Phase 0 revised.** The `@connectum/proto` package was removed from the monorepo (see [ADR-003](./003-package-decomposition.md)). Instead of npm-publishing `@connectum/proto`, the recommended approach is BSR deps in `buf.yaml` for third-party proto definitions (`buf.build/googleapis/googleapis`, `buf.build/bufbuild/protovalidate`, etc.). Framework clients obtain types via `@connectum/cli proto sync` (Phase 2) from a running server or via their own `buf.yaml` with BSR deps + `buf.lock`. Connectum is a framework that provides proto distribution tools, not vendored definitions.

**Current approach**: Clients use BSR deps in their `buf.yaml`:

```yaml
# Client's buf.yaml
version: v2
deps:
  - buf.build/googleapis/googleapis
  - buf.build/bufbuild/protovalidate
```

Or obtain types via the reflection CLI:

```bash
connectum proto sync --from localhost:5000 --out ./generated/
```

### Phase 1: Replace Reflection Server with @lambdalisue/connectrpc-grpcreflect (v0.3.0)

Instead of fixing the custom `withReflection.ts`, replace it with the proven community package `@lambdalisue/connectrpc-grpcreflect`, which:

- Correctly serializes FileDescriptorProto (including transitive dependencies)
- Supports gRPC Reflection v1 + v1alpha (auto-detection)
- Uses the same `router.service()` pattern
- Fully compatible with `@bufbuild/protobuf` ^2.10.1 and `@connectrpc/connect` ^2.1.1

```typescript
import { registerServerReflectionFromFileDescriptorSet } from "@lambdalisue/connectrpc-grpcreflect/server";
import { create, toBinary } from "@bufbuild/protobuf";
import { FileDescriptorSetSchema } from "@bufbuild/protobuf/wkt";
import type { DescFile } from "@bufbuild/protobuf";

/**
 * Convert DescFile[] (collected by Server.ts from router.service())
 * to FileDescriptorSet for @lambdalisue/connectrpc-grpcreflect.
 */
function buildFileDescriptorSet(files: DescFile[]): Uint8Array {
    const set = create(FileDescriptorSetSchema, {
        file: files.map((f) => f.proto),
    });
    return toBinary(FileDescriptorSetSchema, set);
}

// In Server.ts when registering reflection:
if (reflection) {
    const binpb = buildFileDescriptorSet(registry);
    registerServerReflectionFromFileDescriptorSet(router, binpb);
    // Registers v1 + v1alpha automatically
}
```

This replaces the **entire** custom `withReflection.ts` (143 lines with two TODOs) with ~10 lines of integration code.

### Security Model

Reflection is explicitly enabled and disabled by default:

```typescript
const server = createServer({
    services: [routes],
    port: 5000,
    // Reflection DISABLED by default
    reflection: false,
});

// Typical pattern: enable only in development/staging
const server = createServer({
    services: [routes],
    port: 5000,
    reflection: process.env.NODE_ENV !== "production",
});

// Explicit enablement (deliberate developer decision)
const server = createServer({
    services: [routes],
    port: 5000,
    reflection: true,
});
```

### Phase 2: Reflection CLI MVP (v0.3.0)

CLI tool for syncing types with a running development server:

```bash
# Sync proto types with a running dev server
connectum proto sync --from localhost:5000 --out ./generated/

# Specific services only
connectum proto sync --from localhost:5000 --services "user.v1.*,order.v1.*"

# Dry-run: show what will be synced
connectum proto sync --from localhost:5000 --dry-run

# With custom buf.gen.yaml configuration
connectum proto sync --from localhost:5000 --config ./buf.gen.yaml
```

CLI pipeline architecture:

```
+--------------+    +----------------------+    +-----------------+    +------------+
| Running      |    | ServerReflectionClient|    | FileDescriptorSet|    | buf        |
| Connectum    |--->| (@lambdalisue/       |--->| .binpb file     |--->| generate   |
| Server       |    |  connectrpc-         |    | (binary proto)  |    | (codegen)  |
|              |    |  grpcreflect/client)  |    |                 |    |            |
+--------------+    +----------------------+    +-----------------+    +------------+
       |                   |                        |                    |
  gRPC Reflection    listServices() +         toBinary() ->         TypeScript
  Protocol           buildFileRegistry()      FileDescriptorSet    stubs in
  (auto v1/v1alpha)  (ConnectRPC native)      -> .binpb file       --out dir
```

Key advantages:
- **ConnectRPC-native** -- uses `@connectrpc/connect-node` transport, `@bufbuild/protobuf` types. No foreign dependencies (`@grpc/grpc-js`, `google-protobuf`).
- **Single package** -- `@lambdalisue/connectrpc-grpcreflect` is used both server-side (Phase 1) and client-side (Phase 2).
- **No .proto reconstruction** -- feeds binary FileDescriptorSet directly to `buf generate` ([Buf Inputs Reference](https://buf.build/docs/reference/inputs/)).

### Phase 3: OpenAPI Generation (v0.4.0)

Add OpenAPI v3.1 generation from proto definitions for HTTP/JSON clients:

```bash
# Generate OpenAPI from proto
connectum proto openapi --out ./docs/openapi.yaml
```

```yaml
# buf.gen.yaml -- additional plugin
plugins:
  - local: protoc-gen-es
    out: gen-ts
    opt:
      - target=ts
      - import_extension=.js
    include_imports: true
  - local: protoc-gen-connect-openapi
    out: docs
    opt:
      - format=yaml
```

Swagger UI can be connected as static HTML or a dev server endpoint for API visualization.

---

## Consequences

### Positive

- **Zero manual proto distribution** -- a single command (`connectum proto sync` or BSR deps in `buf.yaml`) syncs types
- **Always in sync** with the running server -- reflection CLI guarantees type freshness in development
- **Low implementation complexity** -- 2-4 weeks instead of 6-10 thanks to ready-made tools (`@lambdalisue/connectrpc-grpcreflect`, `buf generate`, `protoc-gen-connect-openapi`)
- **buf generate compatible** -- standard codegen pipeline, not a custom solution
- **grpcurl/Postman support** -- completed reflection server enables service debugging and exploration
- **Progressive complexity** -- BSR deps for the basic case, Phase 2 (CLI) for dev convenience, Phase 3 (OpenAPI) for web developers
- **OpenAPI generation** -- documentation for HTTP/JSON clients, Swagger UI for free

### Negative

- **Requires running server** (Phase 2) -- CLI depends on dev server availability for reflection. **Mitigation**: BSR deps in `buf.yaml` don't require a running server and cover the basic use case.
- **Loss of comments** -- FileDescriptorProto does not contain comments from .proto files. **Mitigation**: not needed for codegen; source of truth for documentation = git-managed .proto files.
- **Security risk** -- reflection in production exposes full API schema. **Mitigation**: disabled by default (`reflection: false`), opt-in per environment, documentation with warnings.
- **Extra dependency** -- `@lambdalisue/connectrpc-grpcreflect` adds a dependency to `@connectum/core`. **Mitigation**: the package uses the same `@bufbuild/protobuf` and `@connectrpc/connect` already in the project -- zero new transitive dependencies. MIT license, 115 passing tests.

---

## Alternatives Considered

### Alternative 1: Buf Schema Registry (BSR)

**Rating:** 6/10

**Description:** Managed registry with versioning, breaking change detection, multi-language SDK generation. Clients obtain types via `buf generate --from buf.build/org/api`.

**Pros:** Semver versioning for proto contracts; multi-language SDK generation (Go, Java, Python, TypeScript); built-in breaking change detection; hosted documentation.

**Cons:** External SaaS dependency (vendor lock-in); over-engineering for an alpha single-language framework; additional infrastructure and account; network dependency during generation.

**Why rejected for now:** BSR is worth considering when multi-language SDK generation is needed.

### Alternative 2: Git Submodules for proto files

**Rating:** 5/10

**Description:** Shared proto repository as a git submodule in each client project.

**Pros:** Simple setup; git tags for versioning; all comments preserved; no external dependencies.

**Cons:** Manual sync (git submodule update); git submodules are a known pain point (detached HEAD, nested repos); no automatic code generation; doesn't scale with growing client count.

**Why rejected:** Git submodules create friction in the developer workflow. Manual synchronization contradicts the goal of zero manual distribution.

### Alternative 3: Only npm Package (no Reflection CLI)

**Rating:** 7/10

**Description:** Publish `@connectum/proto` with generated TypeScript types to npm, without a reflection CLI.

**Pros:** Simplest approach; semver versioning via changesets; works with existing npm ecosystem tools; no additional dependencies.

**Cons:** Manual publish cycle for every proto change; no auto-sync with dev server; reflection server remains broken (no grpcurl/Postman support).

**Why partially accepted:** Phase 0 used this approach as a baseline. Reflection CLI (Phase 2) supplements it for dev convenience.

### Alternative 4: OpenAPI-only (no gRPC Reflection)

**Rating:** 5/10

**Description:** ConnectRPC supports HTTP/JSON, OpenAPI is generated via `protoc-gen-connect-openapi`, clients use `openapi-generator` for any language.

**Pros:** Familiar to web developers; Swagger UI documentation for free; multi-language clients via openapi-generator; REST-like API exploration.

**Cons:** Not suitable for gRPC-native clients (streaming, binary efficiency); loses streaming support (OpenAPI doesn't describe bidirectional streaming); duplication -- OpenAPI and protobuf describe the same API.

**Why partially accepted:** Phase 3 adds OpenAPI generation as a supplement to gRPC reflection, not a replacement.

### Alternative 5: grpc-js-reflection-client (npm)

**Rating:** 3/10

**Description:** Ready-made reflection client for Node.js using `@grpc/grpc-js` and `google-protobuf`.

**Pros:** Ready-made solution, zero custom reflection code; active maintenance.

**Cons:** Uses `@grpc/grpc-js` -- incompatible with ConnectRPC transport ecosystem; uses `google-protobuf` -- incompatible with `@bufbuild/protobuf` (Connectum standard); two competing protobuf runtimes in one project; no type interop between `google-protobuf` and `@bufbuild/protobuf` types.

**Why rejected:** Incompatible dependency ecosystem. Connectum is fully built on `@bufbuild/protobuf` + `@connectrpc/connect`. Mixing with `@grpc/grpc-js` + `google-protobuf` creates dependency hell and type mismatches. `@lambdalisue/connectrpc-grpcreflect` provides the same functionality in ConnectRPC-native form.

### Alternative 6: Full Custom CLI (no buf generate)

**Rating:** 4/10

**Description:** Custom .proto reconstruction from FileDescriptorProto + custom TypeScript codegen. Fully hand-written solution.

**Pros:** No dependency on Buf CLI; full control over output; can add custom logic.

**Cons:** 6-10 weeks of development instead of 2-4; reinventing the wheel (buf generate already does this); loss of comments during .proto reconstruction; custom codegen requires ongoing maintenance; bug parity with `protoc-gen-es` is impossible.

**Why rejected:** `buf generate` accepts binary FileDescriptorSet (`.binpb`) directly -- no need to reconstruct `.proto` text files. Ready-made tools cover 100% of the pipeline.

---

## Implementation Plan

### Phase 0: BSR deps approach (v0.2.0) -- REVISED

> **Update (2026-02-12):** Phase 0 revised. `@connectum/proto` removed. BSR deps approach is recommended instead of npm publish.

**Current approach:**
1. Clients add third-party proto deps to their `buf.yaml` via BSR: `buf.build/googleapis/googleapis`, `buf.build/bufbuild/protovalidate`, etc.
2. Run `buf dep update` to update `buf.lock`
3. Use `buf generate` for code generation from their own proto files
4. Use `connectum proto sync` (Phase 2) to obtain types from a running server

### Phase 1: Replace Reflection Server (v0.3.0) -- 3-4 days

1. Add `@lambdalisue/connectrpc-grpcreflect` to `@connectum/core` dependencies
2. Replace custom `withReflection.ts` with `registerServerReflectionFromFileDescriptorSet()`
3. Convert `DescFile[]` registry to `FileDescriptorSet` binary
4. Remove legacy handling from `Server.ts`
5. Change `reflection` default to `false` in `createServer()`
6. Update unit and integration tests
7. Integration tests with `grpcurl` and `buf curl`
8. Document security implications

### Phase 2: Reflection CLI MVP (v0.3.0) -- 1-2 weeks

1. Create `@connectum/cli` package or subcommand in existing CLI
2. Use `ServerReflectionClient` from `@lambdalisue/connectrpc-grpcreflect/client` (ConnectRPC-native, zero foreign dependencies)
3. Implement pipeline: `ServerReflectionClient` -> `buildFileRegistry()` -> `.binpb` -> `buf generate` -> output
4. CLI interface: `connectum proto sync --from <addr> --out <dir>`
5. Support `--dry-run`, `--services` filter, `--config` for custom buf.gen.yaml
6. Integration tests: sync against running Connectum server
7. Add output directory to `.gitignore` template

### Phase 3: OpenAPI Generation (v0.4.0) -- 1 week

1. Integrate `protoc-gen-connect-openapi` into buf.gen.yaml
2. Generate OpenAPI v3.1 from proto definitions
3. Swagger UI setup (static HTML or dev server endpoint)
4. Documentation for HTTP/JSON clients in guide/

---

## Implementation Status

### Phase 1: Reflection Server -- DONE (2026-02-11)

All Phase 1 tasks completed:

| Task | Status | Description |
|------|--------|-------------|
| #34 | DONE | `withReflection.ts` replaced with `@lambdalisue/connectrpc-grpcreflect` server |
| #24 | DONE | `reflection` default changed to `false` in `createServer()` |
| #25 | DONE | Unit tests rewritten with real `GenFile` descriptors |
| #26 | DONE | Integration test: real server + `ServerReflectionClient` verifying `listServices`, `getFileContainingSymbol`, `buildFileRegistry`, `getServiceDescriptor` |
| #27 | DONE | Documentation updated |

**Key implementation details:**

- Server-side: `registerServerReflectionFromFileDescriptorSet()` from `@lambdalisue/connectrpc-grpcreflect/server`
- `DescFile[]` registry collected by `Server.ts` via patched `router.service()` is converted to `FileDescriptorSet` and passed to the library
- Both gRPC Reflection v1 and v1alpha are registered automatically
- Integration test uses `ServerReflectionClient` from `@lambdalisue/connectrpc-grpcreflect/client` with `createGrpcTransport` (HTTP/2)
- Files:
  - `packages/core/src/protocols/reflection/withReflection.ts` -- server-side wrapper
  - `packages/core/tests/unit/withReflection.test.ts` -- unit tests
  - `packages/core/tests/integration/reflection.test.ts` -- integration tests

### Phase 2: CLI Tool -- DONE (2026-02-11)

All Phase 2 tasks completed:

| Task | Status | Description |
|------|--------|-------------|
| #28 | DONE | `@connectum/cli` package scaffolded: package.json, citty entry point, directory structure |
| #29 | DONE | Reflection client wrapper: `fetchReflectionData()`, `fetchFileDescriptorSetBinary()` |
| #30 | DONE | Pipeline: ServerReflectionClient -> .binpb -> `buf generate` -> output directory |
| #31 | DONE | `--dry-run` mode: list services and files without generating code |
| #32 | DONE | Integration tests: fetchReflectionData, fetchFileDescriptorSetBinary, dry-run against real server |
| #33 | DONE | README.md for @connectum/cli, ADR-020 updated |

**Key implementation details:**

- CLI framework: `citty` with nested subcommands (`connectum proto sync`)
- Reflection client: `ServerReflectionClient` from `@lambdalisue/connectrpc-grpcreflect/client`
- Transport: `createGrpcTransport` from `@connectrpc/connect-node` (HTTP/2)
- Binary serialization: `create(FileDescriptorSetSchema)` + `toBinary()` from `@bufbuild/protobuf`
- Code generation: `buf generate <tmpfile.binpb> --output <dir>` via `child_process.execSync`
- Temporary files cleaned up after generation

**Files:**
- `packages/cli/src/index.ts` -- CLI entry point
- `packages/cli/src/commands/proto-sync.ts` -- proto sync command with --from, --out, --template, --dry-run
- `packages/cli/src/utils/reflection.ts` -- reflection client utilities
- `packages/cli/tests/integration/proto-sync.test.ts` -- integration tests
- `packages/cli/README.md` -- package documentation

---

## References

1. [gRPC Server Reflection Protocol](https://github.com/grpc/grpc/blob/master/doc/server-reflection.md) -- reflection protocol specification
2. [@lambdalisue/connectrpc-grpcreflect (npm)](https://www.npmjs.com/package/@lambdalisue/connectrpc-grpcreflect) -- ConnectRPC-native reflection server + client (v1 + v1alpha, `@bufbuild/protobuf` compatible)
3. [Buf Inputs Reference (.binpb)](https://buf.build/docs/reference/inputs/) -- binary FileDescriptorSet as input for buf generate
4. [protoc-gen-connect-openapi](https://github.com/sudorandom/protoc-gen-connect-openapi) -- OpenAPI generation from proto definitions
5. [ConnectRPC gRPC Compatibility](https://connectrpc.com/docs/go/grpc-compatibility/) -- gRPC protocol support in ConnectRPC
6. [Buf Schema Registry](https://buf.build/product/bsr) -- managed proto registry (Alternative 1)
7. [@bufbuild/protobuf v2](https://buf.build/blog/protobuf-es-v2) -- `createFileRegistry()`, `toBinary()`, `FileDescriptorProtoSchema`
8. [ADR-003: Package Decomposition](./003-package-decomposition.md) -- @connectum/proto placement in Layer 0 [Update: @connectum/proto removed, see ADR-003]
9. [ADR-009: Buf CLI Migration](./009-buf-cli-migration.md) -- buf generate pipeline, buf.gen.yaml configuration
10. ADR-010: Framework vs Infrastructure (internal planning document) -- boundary: reflection = framework, registry = infrastructure

---

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2026-02-07 | Tech Lead | Initial ADR: Reflection-based Proto Synchronization, 4-phase roadmap |
| 2026-02-10 | Tech Lead | Replace grpc-js-reflection-client with @lambdalisue/connectrpc-grpcreflect (ConnectRPC-native, server+client). Phase 1: replace withReflection.ts instead of fixing TODOs |
| 2026-02-11 | Tech Lead | Phase 1 DONE: Integration tests, documentation. Status updated to Accepted |
| 2026-02-11 | Tech Lead | Phase 2 DONE: @connectum/cli package with proto sync command, integration tests, documentation |
| 2026-02-12 | Tech Lead | Phase 0 revised: @connectum/proto removed, replaced by BSR deps approach. See ADR-003 update |

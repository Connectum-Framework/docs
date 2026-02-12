# ADR-003: Package Decomposition Strategy

## Status

**Accepted** - 2025-12-22

> **Update (v0.2.0-beta.2, 2026-02-12)**: Package `@connectum/utilities` removed. All utilities (~800 lines) had better alternatives as Node.js built-ins or npm packages: `retry()` replaced by `cockatiel`, `sleep()` by `node:timers/promises`, `withTimeout()` by `AbortSignal.timeout()`, `LRUCache` by `lru-cache` npm. Configuration module (`ConnectumEnvSchema`, `parseEnvConfig`) moved to `@connectum/core/config`.
>
> **Update (v0.2.0-beta.2, 2026-02-12)**: Package `@connectum/proto` removed. It contained third-party proto definitions (Google APIs, buf/validate, OpenAPI v3) but had zero internal consumers. Proto distribution solved via `@connectum/reflection` + `@connectum/cli proto sync` (see [ADR-020](./020-reflection-proto-sync.md)). Third-party proto definitions available through BSR deps in `buf.yaml`. The monorepo now contains **6 packages** in 3 layers. Layer 0 contains only `@connectum/otel`.

## Context

Connectum is built as a universal framework for gRPC/ConnectRPC microservices. The predecessor was a monolithic package containing ~15-20 modules with mixed infrastructure and domain concerns.

### Problems with the Monolithic Approach

1. **Coupling**: Everything depends on everything
2. **Bundle Size**: Users pull the entire package even when they need a single utility
3. **Mixed Concerns**: Infrastructure + domain logic in one package
4. **Versioning**: A breaking change in one module forces a major bump for the whole package
5. **Reusability**: Difficult to use parts in other projects

### Target Audience

Connectum is a **universal** framework for ANY gRPC/ConnectRPC services:
- Must NOT contain domain-specific logic
- Must be modular -- use only what you need
- Must have clear separation of responsibilities

### Decomposition Principles

1. **Single Responsibility**: Each package handles one task
2. **Layered Architecture**: Strict dependency hierarchy
3. **Low Coupling**: Minimal dependencies between packages
4. **High Cohesion**: Related components in the same package
5. **Independent Versioning**: Each package can be versioned independently (future)

## Decision

**We decompose into 6 packages organized in 3 layers (originally 8 packages in 4 layers, refined over time).**

### Current Package Structure

```
@connectum/
├── core/               # Layer 0: Server Foundation (zero internal deps)
├── interceptors/       # Layer 1: ConnectRPC interceptors
├── healthcheck/        # Layer 1: gRPC Health Check protocol
├── reflection/         # Layer 1: gRPC Server Reflection protocol
├── otel/               # Layer 2: OpenTelemetry instrumentation
└── testing/            # Layer 2: Testing utilities
```

### Layer 0: Server Foundation (1 package)

#### @connectum/core

**Purpose**: Main server factory (`createServer()`) with HTTP/2 server creation, TLS configuration, protocol plugin system, and explicit lifecycle control. Also contains the configuration module (`ConnectumEnvSchema`, `parseEnvConfig`) moved from the removed `@connectum/utilities`.

**Why Layer 0**: Core is the foundation that all other packages extend. It has **zero internal dependencies** -- only external npm packages. Interceptors and protocols are passed explicitly by the user.

**Key API**:

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { withReflection } from '@connectum/reflection';
import { createDefaultInterceptors } from '@connectum/interceptors';

const server = createServer({
  services: [routes],
  port: 5000,
  interceptors: createDefaultInterceptors(),
  protocols: [Healthcheck({ httpEnabled: true }), withReflection()],
  shutdown: { autoShutdown: true, timeout: 30000 },
});

server.on('ready', () => {
  healthcheckManager.update(ServingStatus.SERVING);
});

await server.start();
```

**Internal dependencies**: None

**External dependencies**: `@connectrpc/connect`, `@connectrpc/connect-node`, `@bufbuild/protobuf`, `env-var`, `zod`

---

### Layer 1: Extensions (3 packages)

#### @connectum/interceptors

**Purpose**: ConnectRPC interceptors for cross-cutting concerns.

**Contains**: errorHandler, timeout, bulkhead, circuitBreaker, retry, fallback, validation, serializer interceptors. Exports `createDefaultInterceptors()` factory for standard interceptor chain assembly (see [ADR-023](./023-uniform-registration-api.md)).

**Why separate**: Interceptors are a distinct architectural pattern. Users choose which interceptors to use, can add custom ones, and can test them independently.

**Internal dependencies**: `@connectum/otel`

**External dependencies**: `@connectrpc/connect`

#### @connectum/healthcheck

**Purpose**: gRPC Health Check protocol implementation (gRPC + HTTP endpoints).

**Why separate**: Extracted from core per [ADR-022](./022-protocol-extraction.md) to follow Single Responsibility Principle. Can be used independently or omitted.

**External dependencies**: `@connectrpc/connect`, `@bufbuild/protobuf`

#### @connectum/reflection

**Purpose**: gRPC Server Reflection protocol (v1 + v1alpha).

**Why separate**: Extracted from core per [ADR-022](./022-protocol-extraction.md). Optional capability -- not all deployments need reflection.

**External dependencies**: `@connectrpc/connect`, `@lambdalisue/connectrpc-grpcreflect`

---

### Layer 2: Tools (2 packages)

#### @connectum/otel

**Purpose**: OpenTelemetry instrumentation (traces, metrics, logs).

**Contains**: OTLPProvider, tracer, meter, logger, wrapAll auto-instrumentation, env-based configuration.

**Why separate**: Observability is a distinct concern with heavy `@opentelemetry/*` dependencies. Users can opt out if not needed. Easier to swap the observability provider in the future.

**Dependencies**: `@opentelemetry/*` (7-8 packages)

#### @connectum/testing

**Purpose**: Testing utilities for unit and integration tests.

**Contains**: createTestServer, mockInterceptor, test fixtures.

**Why separate**: Testing is a devDependency concern. Production code should not pull test utilities.

**Internal dependencies**: `@connectum/core` (and all transitive)

---

### examples/ (directory, NOT a package)

**Purpose**: Usage examples (basic-service, custom interceptors, production-ready).

**Location**: Separate `examples` repository, outside the monorepo workspace.

**Why not a package**: Examples are not published, they use packages as external dependencies, serve as E2E tests and onboarding material, and do not add complexity to the dependency graph.

## Consequences

### Positive

1. **Modularity** -- users install only what they need:
   ```json
   // Minimal setup
   { "dependencies": { "@connectum/core": "^0.2.0" } }

   // Full stack with observability
   {
     "dependencies": {
       "@connectum/core": "^0.2.0",
       "@connectum/otel": "^0.2.0",
       "@connectum/interceptors": "^0.2.0",
       "@connectum/healthcheck": "^0.2.0",
       "@connectum/reflection": "^0.2.0"
     }
   }
   ```

2. **Clear Separation of Concerns** -- universal infrastructure packages only. No domain-specific logic in Connectum.

3. **Independent Evolution** -- a breaking change in one package does not force a major bump for all. Only affected packages are versioned.

4. **Testability** -- each package can be tested in isolation without pulling the full framework.

5. **Reusability** -- components like `@connectum/otel` or `@connectum/interceptors` can be used in non-Connectum Node.js projects.

### Negative

1. **Dependency Management Complexity** -- multiple packages to install instead of one. Mitigated by documentation with recommended package sets and future possibility of a meta-package (`@connectum/all`).

2. **Version Compatibility** -- risk of incompatible versions between packages. Mitigated by synchronized versioning strategy (all packages bump together) via changesets.

3. **Documentation Fragmentation** -- 6 packages = 6 READMEs. Mitigated by centralized docs site, cross-package examples, and a single getting-started entry point.

### Trade-off Analysis

| Aspect | Monolith | Modular (6 packages) |
|--------|----------|---------------------|
| **Bundle Size** | Large | Small |
| **Setup Complexity** | Simple (1 pkg) | Medium (3-5 pkgs) |
| **Reusability** | Low | High |
| **Testability** | Medium | High |
| **Separation of Concerns** | Poor | Excellent |
| **Independent Evolution** | Blocked | Possible |

Modular approach wins on most criteria. Setup complexity is compensated by documentation and tooling.

## Alternatives Considered

### Alternative 1: Monolith (single package)

**Rating**: 3/10. Simplest setup, but does not solve fundamental problems -- large bundle, mixed concerns, poor reusability.

### Alternative 2: Two Packages (Core + Extensions)

**Rating**: 5/10. Some modularity, but "core" is still too large (~400KB), mixed concerns remain, cannot opt out of observability.

### Alternative 3: Micro-packages (15-20 packages)

**Rating**: 4/10. Maximum granularity, but extreme dependency management complexity and poor developer experience. Diminishing returns.

### Alternative 4: Domain-Driven Packages

**Rating**: 6/10. Packages aligned to domain areas (server, telemetry, data, middleware). Unclear boundaries -- layer-based approach provides cleaner separation.

### Alternative 5: Current Decision (6 packages, layered) -- ACCEPTED

**Rating**: 9/10. Clear separation of concerns, layered dependency graph, optimal granularity, each package has a clear purpose, manageable complexity.

## Implementation Guidelines

### Package.json Structure

```json
{
  "name": "@connectum/<name>",
  "version": "0.2.0",
  "type": "module",
  "main": "./src/index.ts",
  "types": "./src/index.ts",
  "exports": {
    ".": {
      "types": "./src/index.ts",
      "default": "./src/index.ts"
    }
  },
  "engines": { "node": ">=25.2.0" }
}
```

### Directory Structure

```
packages/<name>/
├── src/
│   ├── index.ts        # Main export
│   └── ...
├── tests/
│   ├── unit/
│   └── integration/
├── package.json
├── tsconfig.json
└── README.md
```

### Requirements per Package

- **README**: Brief description, installation, usage examples, API reference, links to main docs
- **Tests**: >80% unit test coverage, key integration scenarios
- **Documentation**: TypeDoc comments, working examples in the `examples/` repository

## References

1. [Turborepo](https://turbo.build/) -- monorepo build orchestration
2. [pnpm workspaces](https://pnpm.io/workspaces) -- workspace management
3. [pnpm catalog](https://pnpm.io/catalogs) -- dependency catalog
4. Clean Architecture (Uncle Bob), Hexagonal Architecture (Ports & Adapters)

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2025-12-22 | Claude | Initial ADR -- 8 packages in 4 layers |
| 2026-02-12 | Claude | @connectum/utilities removed (8 -> 7 packages) |
| 2026-02-12 | Claude | @connectum/proto removed (7 -> 6 packages, 4 -> 3 layers) |

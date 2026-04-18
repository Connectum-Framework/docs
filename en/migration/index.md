---
title: Migration & Changelog
description: Migration guides and breaking changes for Connectum releases
---

# Migration & Changelog

This page covers breaking changes and migration steps between Connectum releases.

## RC.9 to RC.10

### New: Client-side auth interceptors in `@connectum/auth`

Two new factories were added for outbound ConnectRPC clients, simplifying service-to-service authentication without hand-rolled header wiring.

- `createClientBearerInterceptor()` -- sets the `Authorization` header with a static string or an async token provider (e.g., refreshable access tokens).
- `createClientGatewayInterceptor()` -- forwards the gateway shared secret and propagates auth context headers for internal service-to-service calls.

```typescript
import { createClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import {
  createClientBearerInterceptor,
  createClientGatewayInterceptor,
} from '@connectum/auth';

const transport = createGrpcTransport({
  baseUrl: 'https://upstream.internal',
  interceptors: [
    createClientBearerInterceptor({ token: async () => getAccessToken() }),
    createClientGatewayInterceptor({ secret: process.env.GATEWAY_SECRET! }),
  ],
});

const client = createClient(UserService, transport);
```

**No breaking changes** -- both factories are additive.

### `@connectum/events`: auto-resolve publish topic from proto annotations

`EventBus.publish()` now automatically resolves the topic from the proto `(connectum.events.v1.event).topic` option when no explicit topic is passed. Existing code that already sets `publishOptions.topic` is unaffected; the explicit value still wins.

Priority order: explicit `publishOptions.topic` -> proto annotation -> `schema.typeName` (backward-compatible fallback).

### `@connectum/events`: per-handler middleware configuration

Handlers registered via `router.service()` can now override the global middleware pipeline on a per-handler basis:

```typescript
// Simple handler (uses global middleware)
onEvent: async (msg, ctx) => { /* ... */ }

// Config object with per-handler middleware override
onEvent: {
  handler: async (msg, ctx) => { /* ... */ },
  middleware: [retryMiddleware, metricsMiddleware],
}
```

Both forms coexist -- existing simple-function handlers continue to work without changes.

### `@connectum/events`: stricter handler input types (fix)

`ServiceEventHandlers` now derives handler input types from the concrete `GenService` record instead of a generic `DescMethod` array. This preserves concrete protobuf message types in handlers and eliminates the need for `as unknown as T` casts. If your handlers relied on such casts, you can now remove them -- no functional change is required.

**No breaking changes in this release.**

---

## RC.8 to RC.9

### `@connectum/auth`: `AuthContext` resilient to multiple module evaluations (bug fix)

The internal `authContextStorage` (an `AsyncLocalStorage` used by `AuthContext`) now uses `globalThis` + `Symbol.for()` to guarantee a single instance per process, even when the module is evaluated through multiple runtime paths (for example, tsx source alongside built workspace output in development).

When dual initialization is detected, a one-time `CONNECTUM_AUTH_DUP_INIT` warning is emitted to help diagnose mixed `src/dist` import issues.

**No breaking changes and no action required.** If you previously observed missing `AuthContext` values when mixing compiled and source imports in dev, this release transparently fixes it. If the warning appears in your logs, review your import paths to ensure `@connectum/auth` is not loaded from both source and built outputs.

---

## RC.7 to RC.8

### BREAKING: Serializer interceptor disabled by default

The serializer interceptor is now **disabled by default** in `createDefaultInterceptors()`.

**Why**: Implicit JSON serialization caused issues with streaming between microservices and was unexpected for gRPC services using binary protobuf format.

**When to enable**:
- Your service uses the **Connect protocol** (HTTP/1.1 JSON) and needs protobuf ↔ JSON conversion
- You serve both Connect and gRPC clients and want JSON responses for Connect

**When NOT needed** (no action required):
- Pure gRPC services (binary protobuf)
- Services using `serializer: false` already

**Migration**:

```typescript
// Before (serializer was auto-enabled)
createDefaultInterceptors()

// After — if you need JSON serialization
createDefaultInterceptors({ serializer: true })

// After — if you use gRPC only (no change needed)
createDefaultInterceptors()
```

### Comprehensive test coverage

RC.8 ships with a substantial test-coverage expansion across 10 packages (+225 tests), including new suites for `core/envSchema`, `core/server-lifecycle`, `auth/errors`, `auth/authz-utils`, `cli/proto-sync`, `events/topic`, and `healthcheck/healthcheck-grpc`. This is an internal quality improvement -- no API changes, no action required.

---

## RC.6 to RC.7

### New Package: `@connectum/events-amqp`

AMQP/RabbitMQ adapter for the EventBus. Supports durable queues, topic exchanges, dead letter exchanges, and competing consumers via shared queue names.

```typescript
import { createEventBus } from '@connectum/events';
import { AmqpAdapter } from '@connectum/events-amqp';

const bus = createEventBus({
  adapter: AmqpAdapter({ url: 'amqp://localhost:5672' }),
  routes: [myRoutes],
});
```

See [@connectum/events-amqp documentation](/en/packages/events-amqp) for details.

### EventBus: Auto-Derive Broker Client Identity

`@connectum/events` now automatically derives broker client identity (connection name, client ID) from protobuf service names registered in event routes. This improves observability in broker management UIs without manual configuration.

### OpenTelemetry: Idempotent `initProvider()`

`initProvider()` in `@connectum/otel` is now idempotent -- subsequent calls are no-ops if the provider is already active. This simplifies initialization in tests and multi-module setups.

**No breaking changes in this release.**

---

## RC.5 to RC.6

### New Package: `@connectum/events`

Universal event adapter layer with proto-first pub/sub, pluggable broker adapters, middleware pipeline, and DLQ support. See [ADR-026](/en/contributing/adr/026-eventbus-architecture) for design rationale.

Three broker adapters ship alongside the core package:

- `@connectum/events-nats` -- NATS JetStream adapter
- `@connectum/events-kafka` -- Kafka / Redpanda adapter
- `@connectum/events-redis` -- Redis Streams adapter

```typescript
import { createEventBus, MemoryAdapter } from '@connectum/events';

const bus = createEventBus({
  adapter: MemoryAdapter(),
  routes: [myRoutes],
});
```

See [Events Getting Started](/en/guide/events/getting-started) for a step-by-step guide.

### New Package: `@connectum/testing`

Testing utilities for ConnectRPC interceptors and services: mock factories for requests, streams, next functions, protobuf descriptors, plus a lightweight test server with automatic lifecycle management.

See [@connectum/testing documentation](/en/packages/testing) for details.

### EventBus: Error Classes and Graceful Drain

`@connectum/events` includes `NonRetryableError` and `RetryableError` typed error classes for explicit retry control in event handlers. Active message tracking ensures in-flight handlers complete during shutdown (configurable via `drainTimeout`).

### `@connectum/core`: EventBusLike Integration

`createServer()` now accepts an `eventBus` option. When provided, the server manages the event bus lifecycle (start/stop) alongside the gRPC server, passing its shutdown signal for coordinated graceful shutdown.

**No breaking changes in this release.**

---

## RC.4 to RC.5

### `@connectum/auth`: JWT Key Resolution Priority Change

The JWT auth interceptor changed the key resolution priority:

| | Before (rc.4) | After (rc.5) |
|---|--------|-------|
| **Priority** | `jwksUri` > `secret` > `publicKey` | `jwksUri` > `publicKey` > `secret` |

This is **potentially breaking** if you provide both `publicKey` and `secret`. See [Key Resolution Priority Change](#key-resolution-priority-change-connectumauth) below for migration details.

### `@connectum/auth`: Proto-Based Authorization

New `createProtoAuthzInterceptor()` factory reads authorization rules directly from `.proto` file custom options (`connectum.auth.v1`), eliminating the need for hardcoded rule arrays in application code.

See [Proto-Based Authorization](/en/guide/auth/proto-authz) for details.

### `@connectum/core`: HTTP/1.1 Plaintext Transport Mode

The server now supports three transport modes:

| Mode | Description | Use Case |
|------|-------------|----------|
| TLS (default) | HTTP/2 with TLS | Production |
| h2c | HTTP/2 cleartext | Development, service mesh |
| HTTP/1.1 | HTTP/1.1 plaintext | Legacy clients, ConnectRPC JSON |

### Security Fixes

- `minimatch` overridden to >=10.2.1 (ReDoS vulnerability)
- `ajv` bumped to 8.18.0 (CVE-2025-69873)

**No other breaking changes in this release.**

---

## RC.3 to RC.4

### Compile-Before-Publish with tsup

All `@connectum/*` packages now ship compiled `.js` + `.d.ts` + source maps via [tsup](https://tsup.egoist.dev/). This is the most significant change in rc.4.

| Aspect | Before (rc.3) | After (rc.4) |
|--------|---------------|--------------|
| Published format | Raw `.ts` source | Compiled `.js` + `.d.ts` + `.js.map` |
| Consumer Node.js | >= 25.2.0 (type stripping required) | **>= 20.0.0** (compiled JS) |
| Loader/register hook | Required `@connectum/core/register` | **Not needed** |
| Runtime compatibility | Node.js 25+ only | Node.js 20+, Bun, tsx |

**Migration**: Remove any `--import @connectum/core/register` flags or `register()` calls from your startup scripts. Packages now work out of the box.

### Removed: `@connectum/core/register`

The `@connectum/core/register` subpath export has been removed. It was needed in rc.3 to enable type stripping for raw TypeScript source. Since packages now ship compiled JavaScript, no register hook is needed.

```diff
- node --import @connectum/core/register server.ts
+ node server.js
```

### New Package: `@connectum/auth`

A complete authentication and authorization package with 5 interceptor factories:

- `createAuthInterceptor()` -- Generic pluggable auth
- `createJwtAuthInterceptor()` -- JWT with JWKS support (jose)
- `createGatewayAuthInterceptor()` -- Gateway pre-authenticated headers
- `createSessionAuthInterceptor()` -- Session-based auth (better-auth, lucia)
- `createAuthzInterceptor()` -- Declarative rules-based authorization

See [@connectum/auth documentation](/en/packages/auth) for details.

### Error Handler: SanitizableError Protocol

The error handler interceptor in `@connectum/interceptors` now recognizes the `SanitizableError` protocol from `@connectum/core`. Errors implementing this interface have their `clientMessage` sent to clients while `serverDetails` are preserved for logging.

New `onError` callback option replaces `console.error` for structured error handling:

```typescript
createDefaultInterceptors({
  errorHandler: {
    onError: ({ error, code, serverDetails, stack }) => {
      logger.error('RPC error', { code, serverDetails });
    },
  },
});
```

### OpenTelemetry: Streaming RPC Support

`@connectum/otel` now instruments streaming RPCs (client, server, and bidirectional). Span lifecycle is deferred to stream completion for accurate duration measurement.

### Cross-Runtime Testing

All packages now include `test:bun` and `test:esbuild` scripts via `@exodus/test`. Known incompatibilities (interceptors/bun, otel/bun, cli/bun) gracefully skip.

### Build Pipeline Changes

The turbo build graph has changed:

```
build:proto → build (tsup) → typecheck (tsc --noEmit) → test
```

`typecheck` and `test` now **depend on `build`** (they require compiled `dist/` artifacts). Always run `pnpm build` before `pnpm typecheck` or `pnpm test`.

## Breaking Changes from Alpha

If you are migrating from v0.2.0-alpha.x to v1.0.0-beta.x, the following breaking changes apply:

### API Changes

| Before (alpha) | After (beta) | ADR |
|----------------|--------------|-----|
| `Runner(options)` | `createServer(options)` | [ADR-023](/en/contributing/adr/023-uniform-registration-api) |
| `withReflection()` | `Reflection()` | [ADR-022](/en/contributing/adr/022-protocol-extraction) |
| `withHealthcheck()` | `Healthcheck({ httpEnabled: true })` | [ADR-022](/en/contributing/adr/022-protocol-extraction) |
| `server.health.update()` | `healthcheckManager.update()` | [ADR-022](/en/contributing/adr/022-protocol-extraction) |
| `builtinInterceptors: { ... }` | `interceptors: createDefaultInterceptors({ ... })` | [ADR-023](/en/contributing/adr/023-uniform-registration-api) |

### Package Changes

| Change | Details |
|--------|---------|
| New package: `@connectum/healthcheck` | Extracted from `@connectum/core` |
| New package: `@connectum/reflection` | Extracted from `@connectum/core` |
| New package: `@connectum/cli` | Proto sync via gRPC Server Reflection |
| Removed: `@connectum/utilities` | Merged into other packages |
| Total packages | 6 → 7 |

### Migration Example

**Before (alpha):**

```typescript
import { Runner } from '@connectum/core';

const server = Runner({
    services: [routes],
    port: 5000,
    builtinInterceptors: {
        errorHandler: true,
        logger: { level: 'debug' },
        tracing: true,
    },
    health: { enabled: true },
    reflection: true,
});

server.on('ready', () => {
    server.health.update(ServingStatus.SERVING);
});

await server.start();
```

**After (beta):**

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';
import { createDefaultInterceptors } from '@connectum/interceptors';

const server = createServer({
    services: [routes],
    port: 5000,
    protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
    interceptors: createDefaultInterceptors(),
    shutdown: { autoShutdown: true },
});

server.on('ready', () => {
    healthcheckManager.update(ServingStatus.SERVING);
});

await server.start();
```

### Interceptors: No Auto-Defaults

Starting from v1.0.0-beta.x, `@connectum/core` has **zero internal dependencies**. Omitting the `interceptors` option (or passing `[]`) means **no interceptors are applied**. To use the default resilience chain, explicitly pass `createDefaultInterceptors()`:

```typescript
import { createServer } from '@connectum/core';
import { createDefaultInterceptors } from '@connectum/interceptors';

const server = createServer({
  services: [routes],
  interceptors: createDefaultInterceptors(), // explicit!
});
```

## Key Resolution Priority Change (`@connectum/auth`)

**Affected versions**: v1.0.0-beta.x onwards

The JWT auth interceptor (`createJwtAuthInterceptor`) changed the key resolution priority when multiple key sources are provided:

| | Before | After |
|---|--------|-------|
| **Priority** | `jwksUri` > `secret` > `publicKey` | `jwksUri` > `publicKey` > `secret` |

### Impact

This change only affects configurations that provide **both** `publicKey` and `secret` simultaneously. Previously the symmetric `secret` was used; now the asymmetric `publicKey` takes precedence.

- **No impact** if you use only one of `jwksUri`, `secret`, or `publicKey`
- **No impact** if you use `jwksUri` (highest priority, unchanged)

### Migration

If you rely on the previous behavior where `secret` wins over `publicKey`, remove the `publicKey` option:

```typescript
// Before: secret was used (publicKey was ignored)
const auth = createJwtAuthInterceptor({
  secret: process.env.JWT_SECRET,
  publicKey: myPublicKey, // was silently ignored
});

// After: remove publicKey if you want HMAC verification
const auth = createJwtAuthInterceptor({
  secret: process.env.JWT_SECRET,
});
```

### Rationale

Asymmetric keys (`publicKey`) are cryptographically stronger than symmetric secrets (`secret`). When both are provided, the more secure option should take precedence.

## Changelog

For detailed changelog, see the [CHANGELOG.md](https://github.com/Connectum-Framework/connectum/blob/main/CHANGELOG.md) in the main repository.

## Architecture Decision Records

All significant architectural decisions are documented as ADRs:

- [ADR Index](/en/contributing/adr/) -- Complete list of all accepted Architecture Decision Records

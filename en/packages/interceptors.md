---
title: '@connectum/interceptors'
description: Production-ready ConnectRPC interceptors with resilience patterns
---

# @connectum/interceptors

Production-ready ConnectRPC interceptors providing resilience patterns, error handling, validation, and serialization. Includes a fixed-order default interceptor chain and a method-filter interceptor for per-method configuration.

**Layer**: 1 (Protocol)

::: tip Related Guides
- [Interceptors Overview](/en/guide/interceptors) -- the interceptor chain explained
- [Built-in Chain](/en/guide/interceptors/built-in) -- 8 production-ready interceptors
- [Custom Interceptors](/en/guide/interceptors/custom) -- creating your own interceptors
- [Method Filtering](/en/guide/interceptors/method-filtering) -- per-service/per-method routing
:::

::: tip Full API Reference
Complete TypeScript API documentation: [API Reference](/en/api/@connectum/interceptors/)
:::

## Installation

```bash
pnpm add @connectum/interceptors
```

**Requires**: Node.js 22+

## Quick Start

```typescript
import { createDefaultInterceptors } from '@connectum/interceptors';

// Defaults: errorHandler + validation only (resilience is opt-in)
const interceptors = createDefaultInterceptors();

// Explicitly enable resilience interceptors
const interceptors = createDefaultInterceptors({
  timeout: { duration: 10_000 },
  retry: true,
  circuitBreaker: { threshold: 3 },
});
```

When using `@connectum/core`, pass the result of `createDefaultInterceptors()` to the `interceptors` option:

```typescript
import { createServer } from '@connectum/core';
import { createDefaultInterceptors } from '@connectum/interceptors';

const server = createServer({
  services: [routes],
  interceptors: createDefaultInterceptors({
    errorHandler: { logErrors: true },
    timeout: { duration: 15_000 }, // explicitly enabled
  }),
});
```

## Default Interceptor Chain

The interceptor order is fixed and intentional:

```
errorHandler -> timeout -> bulkhead -> circuitBreaker -> retry -> fallback -> validation -> serializer
```

| # | Interceptor | Purpose | Default |
|---|-------------|---------|---------|
| 1 | **errorHandler** | Catch-all error normalization (outermost) | Enabled |
| 2 | **timeout** | Enforce request deadline | **Opt-in** (30s when enabled) |
| 3 | **bulkhead** | Limit concurrent requests | **Opt-in** (10/10 when enabled) |
| 4 | **circuitBreaker** | Prevent cascading failures (outbound pattern) | **Opt-in** (5 failures when enabled) |
| 5 | **retry** | Retry transient failures with backoff | **Opt-in** (3 retries when enabled) |
| 6 | **fallback** | Graceful degradation | **Opt-in** (requires a handler) |
| 7 | **validation** | Validate request messages (@connectrpc/validate) | Enabled |
| 8 | **serializer** | JSON serialization (innermost) | **Opt-in** |

**No hidden behavioral logic.** Only structural interceptors (errorHandler, validation) are enabled by default. Resilience interceptors (timeout, bulkhead, circuitBreaker, retry) alter request behavior and must be enabled explicitly with `true` or an options object — implicitly enabled resilience caused a confirmed production incident (a server-side circuit breaker tripped by expected business errors).

## API Reference

### `createDefaultInterceptors(options?)`

Creates the full interceptor chain with configurable options.

```typescript
function createDefaultInterceptors(options?: DefaultInterceptorOptions): Interceptor[];
```

Each interceptor can be set to `true` (defaults), `false` (disabled), or an options object.

### `DefaultInterceptorOptions`

```typescript
interface DefaultInterceptorOptions {
  errorHandler?: boolean | ErrorHandlerOptions;      // default: true
  timeout?: boolean | TimeoutOptions;                // default: false (opt-in)
  bulkhead?: boolean | BulkheadOptions;              // default: false (opt-in)
  circuitBreaker?: boolean | CircuitBreakerOptions;  // default: false (opt-in)
  retry?: boolean | RetryOptions;                    // default: false (opt-in)
  fallback?: boolean | FallbackOptions;              // default: false (opt-in)
  validation?: boolean;                              // default: true
  serializer?: boolean | SerializerOptions;          // default: false (opt-in)
}
```

## Individual Interceptors

### Error Handler

Transforms errors into `ConnectError` with proper gRPC status codes. Recognizes the `SanitizableError` protocol from `@connectum/core`: preserves server-side details for logging while exposing only a safe `clientMessage` to the client.

```typescript
import { createErrorHandlerInterceptor } from '@connectum/interceptors';

const interceptor = createErrorHandlerInterceptor({
  logErrors: true,           // default: NODE_ENV !== "production"
  includeStackTrace: false,  // default: NODE_ENV !== "production"
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `logErrors` | `boolean` | `NODE_ENV !== "production"` | Log errors to console. **Deprecated**: use `onError` instead. |
| `includeStackTrace` | `boolean` | `NODE_ENV !== "production"` | Include stack trace in logs |
| `onError` | `(info: { error: Error; code: number; serverDetails?: Record<string, unknown>; stack?: string }) => void` | -- | Error callback. Replaces console.error when provided. Receives rich error info including `serverDetails` from `SanitizableError`. |

### Timeout

Enforces a request deadline before any processing begins.

```typescript
import { createTimeoutInterceptor } from '@connectum/interceptors';

const interceptor = createTimeoutInterceptor({
  duration: 15_000,      // 15 seconds
  skipStreaming: true,   // skip for streaming calls
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `duration` | `number` | `30000` | Request timeout in milliseconds |
| `skipStreaming` | `boolean` | `true` | Skip for streaming calls |

### Bulkhead

Limits concurrent requests to prevent resource exhaustion.

```typescript
import { createBulkheadInterceptor } from '@connectum/interceptors';

const interceptor = createBulkheadInterceptor({
  capacity: 20,       // max concurrent requests
  queueSize: 50,      // max queued requests
  skipStreaming: true,
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `capacity` | `number` | `10` | Maximum concurrent requests |
| `queueSize` | `number` | `10` | Maximum queued requests |
| `skipStreaming` | `boolean` | `true` | Skip for streaming calls |

### Circuit Breaker

Prevents cascading failures by breaking the circuit on consecutive errors.

The circuit breaker is an **outbound/client-side pattern**: it protects the caller from a sick upstream and gives that upstream room to recover. On a server's inbound stack it degenerates into error-rate load shedding — for inbound protection prefer explicit `timeout` + `bulkhead`. When enabled in the default chain, the breaker wraps `retry`, so one logical request increments the failure counter at most once regardless of retry attempts.

```typescript
import { createCircuitBreakerInterceptor } from '@connectum/interceptors';

const interceptor = createCircuitBreakerInterceptor({
  threshold: 5,          // failures before opening
  halfOpenAfter: 30_000, // wait before retrying
  skipStreaming: true,
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `threshold` | `number` | `5` | Consecutive failures before opening |
| `halfOpenAfter` | `number` | `30000` | Milliseconds before half-open attempt |
| `skipStreaming` | `boolean` | `true` | Skip for streaming calls |
| `failurePredicate` | `(error: unknown, defaultPredicate: (error: unknown) => boolean) => boolean` | `defaultFailurePredicate` | Decides which errors count as circuit failures; receives the default predicate for composition |

**Error classification.** By default only infrastructure errors count as circuit failures: `Unknown`, `DeadlineExceeded`, `Internal`, `Unavailable`, `DataLoss`, `ResourceExhausted` (plus any non-`ConnectError` thrown value). Business codes (`invalid_argument`, `not_found`, `failed_precondition`, `already_exists`, ...) never open the breaker, and in half-open state they close it (the upstream answered — it is alive). The default classifier is exported as `defaultFailurePredicate`.

```typescript
import { Code, ConnectError } from '@connectrpc/connect';
import { createCircuitBreakerInterceptor } from '@connectum/interceptors';

// Exclude upstream per-client rate limits from tripping the breaker
createCircuitBreakerInterceptor({
  failurePredicate: (err, def) =>
    def(err) && !(err instanceof ConnectError && err.code === Code.ResourceExhausted),
});

// Restore legacy behavior (every error trips the breaker)
createCircuitBreakerInterceptor({ failurePredicate: () => true });
```

A predicate that throws is fail-closed: the error counts as a failure and the original upstream error is propagated to the caller.

### Retry

Retries transient failures with exponential backoff. Uses the `cockatiel` library.

```typescript
import { createRetryInterceptor } from '@connectum/interceptors';

const interceptor = createRetryInterceptor({
  maxRetries: 3,
  initialDelay: 200,
  maxDelay: 5_000,
  retryableCodes: [Code.Unavailable, Code.ResourceExhausted],
  skipStreaming: true,
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `maxRetries` | `number` | `3` | Maximum retry attempts |
| `initialDelay` | `number` | `200` | Initial backoff delay (ms) |
| `maxDelay` | `number` | `5000` | Maximum backoff delay (ms) |
| `retryableCodes` | `Code[]` | `[Unavailable, ResourceExhausted]` | Error codes that trigger retry |
| `skipStreaming` | `boolean` | `true` | Skip for streaming calls |

### Fallback

Provides graceful degradation when the service fails. Disabled by default because it requires a handler function.

```typescript
import { createFallbackInterceptor } from '@connectum/interceptors';

const interceptor = createFallbackInterceptor({
  handler: (error) => ({ items: [], error: error.message }),
  skipStreaming: true,
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `handler` | `(error: Error) => T \| Promise<T>` | **(required)** | Fallback function |
| `skipStreaming` | `boolean` | `true` | Skip for streaming calls |

### Validation

Validates request messages using `@connectrpc/validate` (protovalidate). No configuration options; toggled on/off.

```typescript
// Enabled by default in createDefaultInterceptors()
// To use standalone:
import { createValidateInterceptor } from '@connectrpc/validate';
const interceptor = createValidateInterceptor();
```

### Serializer

Auto-serializes ConnectRPC responses to JSON format. **Disabled by default** (opt-in).

> **When to enable**: Enable the serializer when your service uses the **Connect protocol** (HTTP/1.1 JSON) and you need automatic protobuf ↔ JSON conversion. Not needed for pure **gRPC** services (binary protobuf format).

```typescript
// Connect protocol service with JSON responses — enable serializer
const interceptors = createDefaultInterceptors({
  serializer: true,
});

// gRPC service (binary protobuf) — serializer not needed (default)
const interceptors = createDefaultInterceptors();

// Custom serializer options
const interceptors = createDefaultInterceptors({
  serializer: {
    alwaysEmitImplicit: true,
    ignoreUnknownFields: false,
  },
});
```

Standalone usage:

```typescript
import { createSerializerInterceptor } from '@connectum/interceptors';

const interceptor = createSerializerInterceptor({
  skipGrpcServices: true,
  alwaysEmitImplicit: true,
  ignoreUnknownFields: true,
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `skipGrpcServices` | `boolean` | `true` | Skip for gRPC services |
| `alwaysEmitImplicit` | `boolean` | `true` | Always emit implicit fields in JSON |
| `ignoreUnknownFields` | `boolean` | `true` | Ignore unknown fields when deserializing |

## Method Filter Interceptor

Routes interceptors to specific methods based on wildcard pattern matching.

```typescript
import { createMethodFilterInterceptor } from '@connectum/interceptors';

const perMethodInterceptor = createMethodFilterInterceptor({
  '*': [logRequest],                                      // all methods
  'admin.v1.AdminService/*': [requireAdmin],              // all service methods
  'user.v1.UserService/DeleteUser': [requireAdmin, auditLog], // exact method
});
```

### Pattern Resolution Order

All matching patterns execute in order:

1. Global wildcard `"*"` (first)
2. Service wildcard `"Service/*"` (second)
3. Exact match `"Service/Method"` (last)

Within each pattern, interceptors execute in array order.

### `MethodFilterMap`

```typescript
type MethodFilterMap = Record<string, Interceptor[]>;
```

## Exports Summary

| Export | Description |
|--------|-------------|
| `createDefaultInterceptors` | Factory for the default interceptor chain |
| `createErrorHandlerInterceptor` | Error normalization |
| `createLoggerInterceptor` | Request logging |
| `createSerializerInterceptor` | JSON serialization |
| `createRetryInterceptor` | Retry with backoff |
| `createCircuitBreakerInterceptor` | Circuit breaker |
| `defaultFailurePredicate` | Default circuit breaker error classifier (infrastructure codes only) |
| `createTimeoutInterceptor` | Request timeout |
| `createBulkheadInterceptor` | Concurrency limiter |
| `createFallbackInterceptor` | Graceful degradation |
| `createMethodFilterInterceptor` | Per-method interceptor routing |

## Related Packages

- **[@connectum/core](./core.md)** -- Uses this package for built-in interceptor chain (dependent)
- **[@connectum/otel](./otel.md)** -- OpenTelemetry interceptor (complementary)

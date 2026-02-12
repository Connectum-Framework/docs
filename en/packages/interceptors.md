---
title: '@connectum/interceptors'
description: Production-ready ConnectRPC interceptors with resilience patterns
---

# @connectum/interceptors

Production-ready ConnectRPC interceptors providing resilience patterns, error handling, validation, and serialization. Includes a fixed-order default chain of 8 interceptors and a method-filter interceptor for per-method configuration.

**Layer**: 1 (Protocol)

**Version**: 1.0.0-beta.2

## Installation

```bash
pnpm add @connectum/interceptors
```

**Requires**: Node.js >= 25.2.0

## Quick Start

```typescript
import { createDefaultInterceptors } from '@connectum/interceptors';

// All defaults (fallback disabled)
const interceptors = createDefaultInterceptors();

// Custom configuration
const interceptors = createDefaultInterceptors({
  retry: false,
  timeout: { duration: 10_000 },
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
    timeout: { duration: 15_000 },
    retry: false,
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
| 2 | **timeout** | Enforce request deadline | Enabled (30s) |
| 3 | **bulkhead** | Limit concurrent requests | Enabled (10/10) |
| 4 | **circuitBreaker** | Prevent cascading failures | Enabled (5 failures) |
| 5 | **retry** | Retry transient failures with backoff | Enabled (3 retries) |
| 6 | **fallback** | Graceful degradation | **Disabled** |
| 7 | **validation** | Validate request messages (@connectrpc/validate) | Enabled |
| 8 | **serializer** | JSON serialization (innermost) | Enabled |

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
  timeout?: boolean | TimeoutOptions;                // default: true
  bulkhead?: boolean | BulkheadOptions;              // default: true
  circuitBreaker?: boolean | CircuitBreakerOptions;  // default: true
  retry?: boolean | RetryOptions;                    // default: true
  fallback?: boolean | FallbackOptions;              // default: false
  validation?: boolean;                              // default: true
  serializer?: boolean | SerializerOptions;          // default: true
}
```

## Individual Interceptors

### Error Handler

Transforms errors into `ConnectError` with proper gRPC status codes.

```typescript
import { createErrorHandlerInterceptor } from '@connectum/interceptors';

const interceptor = createErrorHandlerInterceptor({
  logErrors: true,           // default: NODE_ENV !== "production"
  includeStackTrace: false,  // default: NODE_ENV !== "production"
});
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `logErrors` | `boolean` | `NODE_ENV !== "production"` | Log errors to console |
| `includeStackTrace` | `boolean` | `NODE_ENV !== "production"` | Include stack trace in logs |

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

Auto-serializes ConnectRPC responses to JSON format.

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
| `createDefaultInterceptors` | Factory for the default 8-interceptor chain |
| `createErrorHandlerInterceptor` | Error normalization |
| `createLoggerInterceptor` | Request logging |
| `createSerializerInterceptor` | JSON serialization |
| `createRetryInterceptor` | Retry with backoff |
| `createCircuitBreakerInterceptor` | Circuit breaker |
| `createTimeoutInterceptor` | Request timeout |
| `createBulkheadInterceptor` | Concurrency limiter |
| `createFallbackInterceptor` | Graceful degradation |
| `createMethodFilterInterceptor` | Per-method interceptor routing |

## Related Packages

- **[@connectum/core](./core.md)** -- Uses this package for built-in interceptor chain (dependent)
- **[@connectum/otel](./otel.md)** -- OpenTelemetry interceptor (complementary)

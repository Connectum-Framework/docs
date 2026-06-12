---
outline: deep
---

# Interceptors

Interceptors are the primary mechanism for cross-cutting concerns in Connectum. They wrap RPC calls at the transport level -- adding error handling, timeouts, retries, validation, and more -- without touching business logic.

## Quick Start

```typescript
import { createServer } from '@connectum/core';
import { createDefaultInterceptors } from '@connectum/interceptors';
import routes from '#gen/routes.js';

const server = createServer({
  services: [routes],
  port: 5000,
  // errorHandler + validation by default; resilience is opt-in
  interceptors: createDefaultInterceptors({
    timeout: { duration: 10_000 },  // explicitly enabled
    retry: { maxRetries: 5 },       // explicitly enabled
  }),
  shutdown: { autoShutdown: true },
});

await server.start();
```

## Key Concepts

### How Interceptors Work

A ConnectRPC interceptor is a function that receives `next` and returns a handler. The handler gets control before and after each request, forming a layered pipeline:

```
Request  -> interceptor1 -> interceptor2 -> ... -> handler
Response <- interceptor1 <- interceptor2 <- ... <- handler
```

### Built-in Chain

`createDefaultInterceptors()` is a chain factory for 8 production-ready interceptors in a fixed order:

| # | Interceptor | Purpose | Default |
|---|-------------|---------|---------|
| 1 | **errorHandler** | Normalizes errors into ConnectError | Enabled |
| 2 | **timeout** | Limits request execution time | **Opt-in** (30s when enabled) |
| 3 | **bulkhead** | Limits concurrent requests | **Opt-in** (capacity 10, queue 10 when enabled) |
| 4 | **circuitBreaker** | Prevents cascading failures (outbound pattern) | **Opt-in** (threshold 5 when enabled) |
| 5 | **retry** | Retries transient failures with exponential backoff | **Opt-in** (3 retries when enabled) |
| 6 | **fallback** | Graceful degradation | **Opt-in** (requires a handler) |
| 7 | **validation** | Validates via @connectrpc/validate | Enabled |
| 8 | **serializer** | JSON serialization for protobuf | **Opt-in** |

**No hidden behavioral logic.** Only structural interceptors (errorHandler, validation) are enabled by default. Resilience interceptors (timeout, bulkhead, circuitBreaker, retry) alter request behavior and must be enabled explicitly with `true` or an options object.

### Per-Method Routing

Three approaches for applying interceptors selectively:

| Scenario | Approach |
|----------|----------|
| Interceptor bound to a specific service router | ConnectRPC native (`router.service()`) |
| Declarative routing by pattern | `createMethodFilterInterceptor` |
| Dynamic logic, filtering by request content | Custom interceptor |

## Learn More

- [Built-in Interceptors](/en/guide/interceptors/built-in) -- detailed chain reference, customization, and standalone usage
- [Custom Interceptors](/en/guide/interceptors/custom) -- factory pattern, error handling, testing
- [Method Filtering](/en/guide/interceptors/method-filtering) -- per-service and per-method routing
- [Auth & Authz](/en/guide/auth) -- authentication and authorization interceptors
- [@connectum/interceptors](/en/packages/interceptors) -- Package Guide
- [@connectum/interceptors API](/en/api/@connectum/interceptors/) -- Full API Reference

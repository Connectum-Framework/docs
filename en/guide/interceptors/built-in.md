---
outline: deep
---

# Built-in Interceptors

Connectum provides 8 production-ready interceptors via `createDefaultInterceptors()`. They form a fixed-order chain that covers error handling, resilience, validation, and serialization.

## The Default Chain

```
errorHandler -> timeout -> bulkhead -> circuitBreaker -> retry -> fallback -> validation -> serializer
```

| # | Interceptor | Purpose | Default |
|---|-------------|---------|---------|
| 1 | **errorHandler** | Normalizes errors into `ConnectError` | Enabled |
| 2 | **timeout** | Limits request execution time | **Opt-in** (30s when enabled) |
| 3 | **bulkhead** | Limits concurrent requests | **Opt-in** (capacity 10, queue 10 when enabled) |
| 4 | **circuitBreaker** | Prevents cascading failures (outbound pattern, see below) | **Opt-in** (threshold 5 when enabled) |
| 5 | **retry** | Retries transient failures with exponential backoff | **Opt-in** (3 retries when enabled) |
| 6 | **fallback** | Graceful degradation | **Opt-in** (requires a handler) |
| 7 | **validation** | Validates via `@connectrpc/validate` | Enabled |
| 8 | **serializer** | JSON serialization for protobuf | **Opt-in** |

The order is deliberate: `errorHandler` is outermost (catches everything), `serializer` is innermost (closest to the handler). The order applies to whichever interceptors you enable. In particular, `circuitBreaker` wraps `retry`, so one logical request increments the failure counter at most once regardless of retry attempts.

::: warning No hidden behavioral logic
Only structural interceptors (errorHandler, validation) are enabled by default. Resilience interceptors (timeout, bulkhead, circuitBreaker, retry) alter request behavior and must be enabled explicitly with `true` or an options object — implicitly enabled resilience caused a confirmed production incident (a server-side circuit breaker tripped by expected business errors).
:::

## Circuit Breaker: Placement and Error Classification

The circuit breaker is an **outbound/client-side pattern**: it protects the caller from a sick upstream (fail fast instead of waiting on timeouts) and gives that upstream room to recover. On a server's inbound stack it degenerates into error-rate load shedding — for inbound protection prefer explicit `timeout` + `bulkhead`.

```typescript
// Recommended: circuit breaker on an outbound client transport
import { createConnectTransport } from '@connectrpc/connect-node';
import { createCircuitBreakerInterceptor } from '@connectum/interceptors';

const transport = createConnectTransport({
  baseUrl: 'http://upstream:5000',
  interceptors: [
    createCircuitBreakerInterceptor({ threshold: 5, halfOpenAfter: 30_000 }),
  ],
});
```

**Error classification.** By default only infrastructure errors count as circuit failures: `Unknown`, `DeadlineExceeded`, `Internal`, `Unavailable`, `DataLoss`, `ResourceExhausted` (plus any non-`ConnectError` thrown value). Business codes (`invalid_argument`, `not_found`, `failed_precondition`, `already_exists`, ...) are expected responses of a healthy service: they never open the breaker, and in half-open state they close it.

Customize with `failurePredicate(error, defaultPredicate)` — the default predicate (exported as `defaultFailurePredicate`) is passed in for composition:

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

::: tip When to enable the serializer
Enable the serializer when your service uses the **Connect protocol** (HTTP/1.1 JSON) and you need automatic protobuf ↔ JSON conversion. Not needed for pure **gRPC** services (binary protobuf format).

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
:::

## Using with createServer

The recommended way to add the built-in interceptors:

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

## Customizing the Default Chain

Pass options to `createDefaultInterceptors()` to customize individual interceptors. Pass `true` or an options object to enable an opt-in interceptor; set one of the default-enabled interceptors to `false` to disable it:

```typescript
import { createDefaultInterceptors } from '@connectum/interceptors';

const interceptors = createDefaultInterceptors({
  timeout: { duration: 10_000 },   // Enable timeout (10s)
  bulkhead: { capacity: 20, queueSize: 20 }, // Enable bulkhead with custom limits
  // errorHandler and validation remain enabled by default
});

const server = createServer({
  services: [routes],
  port: 5000,
  protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
  interceptors,
  shutdown: { autoShutdown: true },
});
```

## Combining with Custom Interceptors

Spread the default chain and append your own interceptors:

```typescript
import { createDefaultInterceptors } from '@connectum/interceptors';

const server = createServer({
  services: [routes],
  port: 5000,
  protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
  interceptors: [
    ...createDefaultInterceptors(),
    myCustomInterceptor,  // Added after the built-in chain
  ],
  shutdown: { autoShutdown: true },
});
```

::: tip Auth interceptors require a specific position
If your custom interceptor is an authentication or authorization interceptor from `@connectum/auth`, it must be placed **immediately after** `errorHandler` -- before `timeout` and other resilience interceptors. See the [Custom Interceptors](/en/guide/interceptors/custom) guide for a manual chain example and [ADR-024](/en/contributing/adr/024-auth-authz-strategy) for the rationale.
:::

## Standalone Usage

You can use `createDefaultInterceptors()` outside of `createServer`:

```typescript
import { createDefaultInterceptors } from '@connectum/interceptors';

const interceptors = createDefaultInterceptors({
  timeout: { duration: 10_000 },
  retry: { maxRetries: 5 },
});
```

For detailed documentation on each interceptor, see the [@connectum/interceptors README](https://github.com/Connectum-Framework/connectum/tree/main/packages/interceptors).

## Execution Order

Interceptors execute in the order they are defined. Each interceptor wraps the next one:

```
Request  -> interceptor1 -> interceptor2 -> interceptor3 -> handler
Response <- interceptor1 <- interceptor2 <- interceptor3 <- handler
```

This means:

- **Before-logic** of the first interceptor runs first
- **After-logic** of the first interceptor runs last
- The first interceptor is the outer layer (ideal for error handling)
- The last interceptor is closest to the handler (ideal for serialization)

This is why the default chain places `errorHandler` first and `serializer` last.

## Best Practices

1. **Error handler first** -- place the error handler first in the chain so it catches errors from all subsequent interceptors.

2. **Do not mutate `req.message`** -- create a new request object via spread: `{ ...req, message: newMessage }`.

3. **Always call `next()`** -- if the interceptor does not abort the chain, it must call `next(req)` and return the result.

4. **Cleanup in `finally`** -- use `try/finally` for resource cleanup (timers, counters).

5. **Type safety** -- use `import type { Interceptor }` for type-safe interceptor definitions.

6. **Use factories** -- wrap interceptors in `create*Interceptor(options)` for configurability.

7. **`skip*` options for technical limitations** -- options like `skipStreaming` and `skipGrpcServices` are meant for technical limitations of the interceptor, not for business routing.

8. **`createMethodFilterInterceptor` for routing** -- use it for declarative interceptor routing by service and method.

## Related

- [Interceptors Overview](/en/guide/interceptors) -- quick start and key concepts
- [Custom Interceptors](/en/guide/interceptors/custom) -- factory pattern, error handling, testing
- [Method Filtering](/en/guide/interceptors/method-filtering) -- per-service and per-method routing
- [@connectum/interceptors](/en/packages/interceptors) -- Package Guide
- [@connectum/interceptors API](/en/api/@connectum/interceptors/) -- Full API Reference
- [ADR-006: Resilience Patterns](/en/contributing/adr/006-resilience-pattern-implementation) -- design rationale for the interceptor chain

---
outline: deep
---

# Built-in Interceptors

Connectum provides 8 production-ready interceptors via `createDefaultInterceptors()`. They form a fixed chain that covers error handling, resilience, validation, and serialization.

## The Default Chain

```
errorHandler -> timeout -> bulkhead -> circuitBreaker -> retry -> fallback -> validation -> serializer
```

| # | Interceptor | Purpose | Default |
|---|-------------|---------|---------|
| 1 | **errorHandler** | Normalizes errors into `ConnectError` | Enabled |
| 2 | **timeout** | Limits request execution time | Enabled (30s) |
| 3 | **bulkhead** | Limits concurrent requests | Enabled (capacity 10, queue 10) |
| 4 | **circuitBreaker** | Prevents cascading failures | Enabled (threshold 5) |
| 5 | **retry** | Retries transient failures with exponential backoff | Enabled (3 retries) |
| 6 | **fallback** | Graceful degradation | Disabled |
| 7 | **validation** | Validates via `@connectrpc/validate` | Enabled |
| 8 | **serializer** | JSON serialization for protobuf | Enabled |

The order is deliberate: `errorHandler` is outermost (catches everything), `serializer` is innermost (closest to the handler).

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

Pass options to `createDefaultInterceptors()` to customize individual interceptors. Set an interceptor to `false` to disable it entirely:

```typescript
import { createDefaultInterceptors } from '@connectum/interceptors';

const interceptors = createDefaultInterceptors({
  timeout: { duration: 10_000 },   // Custom timeout (10s instead of 30s)
  retry: false,                     // Disable retry
  bulkhead: { capacity: 20, queueSize: 20 }, // Higher concurrency limits
  // All others remain at defaults
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

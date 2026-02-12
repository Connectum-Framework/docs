---
outline: deep
---

# Interceptors Guide

Interceptors are the primary mechanism for cross-cutting concerns in ConnectRPC. They allow you to add request and response processing at the transport level without touching business logic.

## What Are Interceptors?

A ConnectRPC interceptor is a function that wraps an RPC method call. The interceptor gets control before and after the request is executed, and can modify the request, response, or abort the chain.

```typescript
import type { Interceptor } from '@connectrpc/connect';

const myInterceptor: Interceptor = (next) => async (req) => {
  // Before: modify request or perform checks
  console.log('Request:', req.method.name);

  // Execute: pass the request down the chain
  const res = await next(req);

  // After: modify response or log
  console.log('Response:', res.message);

  return res;
};
```

## Built-in Interceptors (`@connectum/interceptors`)

Connectum provides 8 production-ready interceptors in a fixed chain:

```
errorHandler -> timeout -> bulkhead -> circuitBreaker -> retry -> fallback -> validation -> serializer
```

| # | Interceptor | Purpose | Default |
|---|-------------|---------|---------|
| 1 | **errorHandler** | Normalizes errors into ConnectError | Enabled |
| 2 | **timeout** | Limits request execution time | Enabled (30s) |
| 3 | **bulkhead** | Limits concurrent requests | Enabled (capacity 10, queue 10) |
| 4 | **circuitBreaker** | Prevents cascading failures | Enabled (threshold 5) |
| 5 | **retry** | Retries transient failures with exponential backoff | Enabled (3 retries) |
| 6 | **fallback** | Graceful degradation | Disabled |
| 7 | **validation** | Validates via @connectrpc/validate | Enabled |
| 8 | **serializer** | JSON serialization for protobuf | Enabled |

### Using with createServer

The recommended way to use the built-in interceptors is via `createDefaultInterceptors()`:

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';
import { createDefaultInterceptors } from '@connectum/interceptors';

const server = createServer({
  services: [routes],
  port: 5000,
  protocols: [Healthcheck({ httpEnabled: true }), Reflection()],

  // Use the default interceptor chain
  interceptors: createDefaultInterceptors(),

  shutdown: { autoShutdown: true },
});

server.on('ready', () => {
  healthcheckManager.update(ServingStatus.SERVING);
});

await server.start();
```

### Customizing the Default Chain

Pass options to `createDefaultInterceptors()` to customize individual interceptors:

```typescript
import { createDefaultInterceptors } from '@connectum/interceptors';

const interceptors = createDefaultInterceptors({
  timeout: { duration: 10_000 },   // Custom timeout (10s instead of 30s)
  retry: false,                     // Disable retry
  bulkhead: { capacity: 20, queue: 20 }, // Higher concurrency limits
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

### Combining with Custom Interceptors

You can combine the default chain with your own custom interceptors:

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

### Standalone Usage

You can use `createDefaultInterceptors()` outside of `createServer`:

```typescript
import { createDefaultInterceptors } from '@connectum/interceptors';

const interceptors = createDefaultInterceptors({
  timeout: { duration: 10_000 },
  retry: { maxRetries: 5 },
});
```

For detailed documentation on each interceptor, see the [@connectum/interceptors README](https://github.com/Connectum-Framework/connectum/tree/main/packages/interceptors).

## Per-Service and Per-Method Interceptors

By default, interceptors apply to all RPC methods. Connectum provides three approaches for per-service/per-method targeting.

### ConnectRPC Native (recommended for binding to a specific service)

ConnectRPC natively supports per-service and per-method interceptors through `router.service()` and `router.rpc()` options:

```typescript
import type { ConnectRouter } from '@connectrpc/connect';
import { GreeterService } from '#gen/greeter_pb.js';

export default (router: ConnectRouter) => {
  // Per-service: interceptors for all methods of this service
  router.service(GreeterService, impl, {
    interceptors: [requireAuth],
  });

  // Per-method: interceptors for a specific method
  router.rpc(GreeterService, GreeterService.methods.sayHello, helloImpl, {
    interceptors: [rateLimiter],
  });
};
```

These interceptors are added on top of the global interceptors defined in `createServer()`.

### createMethodFilterInterceptor (declarative routing)

For declarative per-method routing based on wildcard patterns, use `createMethodFilterInterceptor`:

```typescript
import { createMethodFilterInterceptor } from '@connectum/interceptors';

const perMethodInterceptor = createMethodFilterInterceptor({
  // All methods of all services
  '*': [logRequest],

  // All methods of a specific service
  'admin.v1.AdminService/*': [requireAdmin],

  // A specific method
  'user.v1.UserService/DeleteUser': [requireAdmin, auditLog],
});

const server = createServer({
  services: [routes],
  port: 5000,
  protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
  interceptors: [
    ...createDefaultInterceptors(),
    perMethodInterceptor,
  ],
  shutdown: { autoShutdown: true },
});
```

**Patterns:**

| Pattern | Description |
|---------|-------------|
| `"*"` | All methods of all services |
| `"package.Service/*"` | All methods of a service |
| `"package.Service/Method"` | A specific method |

**Execution order:** All matching patterns are executed sequentially from general to specific: global (`*`) -> service wildcard (`Service/*`) -> exact match (`Service/Method`).

**Example: different resilience settings per method:**

```typescript
import {
  createMethodFilterInterceptor,
  createTimeoutInterceptor,
  createCircuitBreakerInterceptor,
} from '@connectum/interceptors';

const perMethodInterceptor = createMethodFilterInterceptor({
  // Fast operations
  'catalog.v1.CatalogService/GetProduct': [
    createTimeoutInterceptor({ duration: 5_000 }),
  ],
  // Heavy operations
  'report.v1.ReportService/*': [
    createTimeoutInterceptor({ duration: 30_000 }),
    createCircuitBreakerInterceptor({ threshold: 3 }),
  ],
});
```

### Custom Interceptor with Manual Filtering

For complex or dynamic conditions:

```typescript
const conditionalAuth: Interceptor = (next) => async (req) => {
  if (req.service.typeName === 'admin.v1.AdminService') {
    await verifyAdminToken(req);
  }
  return next(req);
};
```

### When to Use Which Approach

| Scenario | Approach |
|----------|----------|
| Interceptor bound to a specific service router | ConnectRPC native |
| Declarative routing for a group of services | `createMethodFilterInterceptor` |
| Dynamic logic, filtering by request content | Custom interceptor |

## Creating Custom Interceptors

### Basic Template

```typescript
import type { Interceptor } from '@connectrpc/connect';

interface MyInterceptorOptions {
  someOption?: string;
}

export function createMyInterceptor(options: MyInterceptorOptions = {}): Interceptor {
  // Configuration at creation time (once)
  const { someOption = 'default' } = options;

  // Interceptor function (called for each request)
  return (next) => async (req) => {
    // Before request
    // ...

    // Execute request
    const res = await next(req);

    // After request
    // ...

    return res;
  };
}
```

### Error Handling

```typescript
import { ConnectError } from '@connectrpc/connect';

const errorAwareInterceptor: Interceptor = (next) => async (req) => {
  try {
    return await next(req);
  } catch (err) {
    // Handle error
    const connectErr = ConnectError.from(err);
    console.error(`RPC error: ${connectErr.code} ${connectErr.message}`);
    throw err; // Re-throw to pass down the chain
  }
};
```

### Streaming Support

```typescript
const streamAwareInterceptor: Interceptor = (next) => async (req) => {
  if (req.stream) {
    // Streaming call -- handle stream
    const res = await next(req);
    // Wrap response stream if needed
    return res;
  }

  // Unary call -- standard handling
  const res = await next(req);
  return res;
};
```

### Authentication Interceptor Example

A complete example of a custom authentication interceptor:

```typescript
import type { Interceptor } from '@connectrpc/connect';
import { ConnectError, Code } from '@connectrpc/connect';

export function createAuthInterceptor(): Interceptor {
  return (next) => async (req) => {
    // Extract token from headers
    const token = req.header.get('Authorization');
    if (!token) {
      throw new ConnectError('Unauthorized', Code.Unauthenticated);
    }

    // Validate token (your logic here)
    // const user = await validateToken(token);

    // Continue to next interceptor
    return await next(req);
  };
}
```

Use it with the default chain:

```typescript
import { createDefaultInterceptors } from '@connectum/interceptors';

const server = createServer({
  services: [routes],
  port: 5000,
  protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
  interceptors: [
    ...createDefaultInterceptors(),
    createAuthInterceptor(),
  ],
  shutdown: { autoShutdown: true },
});
```

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

## Next Steps

- [About Connectum](/en/guide/about) -- framework overview and architecture
- [Quickstart](/en/guide/quickstart) -- build your first service
- [ADR-006: Resilience Patterns](/en/contributing/adr/006-resilience-pattern-implementation) -- design rationale for the interceptor chain
- [ADR-014: Method Filter Interceptor](/en/contributing/adr/014-method-filter-interceptor) -- design rationale for per-method routing

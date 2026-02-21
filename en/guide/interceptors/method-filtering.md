---
outline: deep
---

# Per-Method Interceptor Routing

By default, interceptors in the `interceptors` array apply to every request. In practice, you often need different interceptors for different services or methods -- authentication for admin endpoints, aggressive timeouts for fast reads, circuit breakers for external-facing APIs.

Connectum provides three approaches for per-method interceptor routing.

## Approach 1: ConnectRPC Native Per-Service/Per-Method

ConnectRPC natively supports interceptors at the service and method level through `router.service()` and `router.rpc()` options:

```typescript
import type { ConnectRouter } from '@connectrpc/connect';
import { GreeterService } from '#gen/greeter_pb.js';

export default (router: ConnectRouter) => {
  // Per-service -- applies to all methods of GreeterService
  router.service(GreeterService, greeterImpl, {
    interceptors: [requireAuth, auditLog],
  });

  // Per-method -- applies only to SayHello
  router.rpc(GreeterService, GreeterService.methods.sayHello, sayHelloImpl, {
    interceptors: [rateLimiter],
  });
};
```

Use this approach when interceptors are tightly coupled to a specific service in your router definition.

## Approach 2: createMethodFilterInterceptor

`createMethodFilterInterceptor` is a declarative helper for routing interceptors to methods based on wildcard patterns. It produces a single `Interceptor` you can add to the global chain:

```typescript
import {
  createMethodFilterInterceptor,
  createTimeoutInterceptor,
  createCircuitBreakerInterceptor,
} from '@connectum/interceptors';

const perMethodInterceptor = createMethodFilterInterceptor({
  // Global wildcard: applies to all methods
  '*': [logRequest],

  // Service wildcard: applies to all methods of the service
  'admin.v1.AdminService/*': [requireAdmin],

  // Exact match: applies to a specific method only
  'user.v1.UserService/DeleteUser': [requireAdmin, auditLog],
});

const server = createServer({
  services: [routes],
  interceptors: [perMethodInterceptor],
});
```

### Supported Patterns

| Pattern | Description | Example |
|---------|-------------|---------|
| `"*"` | All methods of all services | `"*": [logRequest]` |
| `"package.Service/*"` | All methods of a service | `"admin.v1.AdminService/*": [auth]` |
| `"package.Service/Method"` | Exact method match | `"user.v1.UserService/GetUser": [cache]` |

::: tip
Pattern keys use the protobuf fully-qualified service name (`service.typeName`) plus the method name: `"package.v1.ServiceName/MethodName"`.
:::

### Resolution Order

All matching patterns execute sequentially, from most general to most specific:

```
Request: user.v1.UserService/GetUser

1. "*": [logRequest]                       -- global (always runs)
2. "user.v1.UserService/*": [auth]         -- service-level match
3. "user.v1.UserService/GetUser": [cache]  -- exact method match

Final chain: logRequest -> auth -> cache -> next(req)
```

If no patterns match, the request passes through to the next interceptor in the chain unchanged.

### Invalid Patterns

The following patterns throw an error at creation time:

```typescript
// Empty service name -- throws Error
createMethodFilterInterceptor({ '/*': [auth] });

// No slash separator -- throws Error
createMethodFilterInterceptor({ 'SomeService': [auth] });
```

### Practical Example: Different Resilience Per Method

```typescript
import {
  createDefaultInterceptors,
  createMethodFilterInterceptor,
  createTimeoutInterceptor,
  createCircuitBreakerInterceptor,
} from '@connectum/interceptors';

const resilience = createMethodFilterInterceptor({
  // Fast reads: 5 second timeout
  'catalog.v1.CatalogService/GetProduct': [
    createTimeoutInterceptor({ duration: 5_000 }),
  ],

  // Heavy reports: 60 second timeout + circuit breaker
  'report.v1.ReportService/*': [
    createTimeoutInterceptor({ duration: 60_000 }),
    createCircuitBreakerInterceptor({ threshold: 3 }),
  ],

  // Admin mutations: audit logging
  'admin.v1.AdminService/*': [
    createAuditLogInterceptor(),
  ],
});

const server = createServer({
  services: [routes],
  interceptors: [
    // Default chain with global timeout as fallback
    ...createDefaultInterceptors({ timeout: { duration: 30_000 } }),
    resilience,
  ],
});
```

## Approach 3: Custom Interceptor with Manual Filtering

For dynamic or complex filtering logic that does not fit wildcard patterns, write a custom interceptor:

```typescript
import type { Interceptor } from '@connectrpc/connect';

const conditionalAuth: Interceptor = (next) => async (req) => {
  // Dynamic condition: check service name at runtime
  if (req.service.typeName === 'admin.v1.AdminService') {
    await verifyAdminToken(req);
  }

  // Check method kind
  if (req.method.kind === 'server_streaming') {
    attachStreamMonitoring(req);
  }

  return next(req);
};
```

Use this approach for filtering based on request content, runtime state, or conditions that cannot be expressed as static patterns.

## skip* Options on Built-in Interceptors

The built-in resilience interceptors have `skip*` options that serve a different purpose from method filtering. These are **technical constraints**, not routing concerns:

| Option | Used by | Why |
|--------|---------|-----|
| `skipStreaming` | timeout, bulkhead, circuitBreaker, retry, fallback | Resilience patterns wrap the full call. You cannot retry a stream, timeout a long-lived connection, or replace a stream with a fallback value. |
| `skipGrpcServices` | serializer | JSON serialization is incompatible with gRPC binary protocol. |
| `skipHealthCheck` | logger | Convenience shortcut to reduce log noise from frequent health checks. |

These options complement `createMethodFilterInterceptor`. Method filtering handles business routing ("which interceptors for which methods"), while `skip*` handles technical limitations ("this interceptor cannot operate on this call type").

## Choosing the Right Approach

| Scenario | Approach |
|----------|----------|
| Interceptor tied to a specific service in router code | ConnectRPC native (`router.service()` / `router.rpc()`) |
| Declarative routing by pattern across multiple services | `createMethodFilterInterceptor` |
| Dynamic logic based on request content or runtime state | Custom interceptor with manual filtering |
| Technical limitation (streaming, binary protocol) | `skip*` options on built-in interceptors |

::: warning
Do not confuse `skip*` options with method filtering. Setting `skipStreaming: true` on the retry interceptor means "retry cannot handle streams" -- it is not a routing decision. Use `createMethodFilterInterceptor` or router-level interceptors for business routing.
:::

## Related

- [Interceptors Overview](/en/guide/interceptors) -- quick start and key concepts
- [Built-in Interceptors](/en/guide/interceptors/built-in) -- default chain reference
- [Custom Interceptors](/en/guide/interceptors/custom) -- creating custom interceptors
- [Custom Protocols](/en/guide/protocols/custom) -- creating protocol plugins
- [@connectum/interceptors](/en/packages/interceptors) -- Package Guide
- [ADR-014: Method Filter Interceptor](/en/contributing/adr/014-method-filter-interceptor) -- design rationale

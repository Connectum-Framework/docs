[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [method-filter](../index.md) / createMethodFilterInterceptor

# Function: createMethodFilterInterceptor()

> **createMethodFilterInterceptor**(`methods`): `Interceptor`

Defined in: [method-filter.ts:175](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/method-filter.ts#L175)

Create a method filter interceptor that routes to per-method interceptors
based on wildcard pattern matching.

Resolution order (all matching patterns execute):
1. Global wildcard `"*"` (executed first)
2. Service wildcard `"Service/*"` (executed second)
3. Exact match `"Service/Method"` (executed last)

Within each pattern, interceptors execute in array order.

A key is one of the three forms above, where `Service` is the protobuf
fully-qualified service name and `Method` the method name, each non-empty and
free of `*`, `/` and whitespace. Any other key (`/Unary`, `Svc/`, `Svc/Un*`,
`a/b/*`, a wildcard as the service name, a key with a space) can never match a call, so it throws
an `Error` at creation. Each value must be an array of functions and the map
an object, otherwise a `TypeError` is thrown; a `null` or `undefined` entry is
not skipped. Names are compared exactly, case included: a key such as
`acme.v1.svc/unary` is well formed but matches nothing if the service is
`acme.v1.Svc`, and the interceptor cannot tell, because it does not see the
registered services.

## Parameters

### methods

[`MethodFilterMap`](../../type-aliases/MethodFilterMap.md)

Method pattern to interceptors mapping

## Returns

`Interceptor`

ConnectRPC interceptor

## Examples

**Auth per service**

```typescript
import { createMethodFilterInterceptor } from '@connectum/interceptors';

const perMethodInterceptor = createMethodFilterInterceptor({
  "*": [logRequest],
  "admin.v1.AdminService/*": [requireAdmin],
  "user.v1.UserService/DeleteUser": [requireAdmin, auditLog],
});

const server = createServer({
  services: [routes],
  interceptors: [perMethodInterceptor],
});
```

**Resilience per method**

```typescript
createMethodFilterInterceptor({
  "catalog.v1.CatalogService/GetProduct": [
    createTimeoutInterceptor({ duration: 5_000 }),
  ],
  "report.v1.ReportService/*": [
    createTimeoutInterceptor({ duration: 30_000 }),
    createCircuitBreakerInterceptor({ threshold: 3 }),
  ],
});
```

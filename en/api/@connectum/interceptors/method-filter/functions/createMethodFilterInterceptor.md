[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [method-filter](../index.md) / createMethodFilterInterceptor

# Function: createMethodFilterInterceptor()

> **createMethodFilterInterceptor**(`methods`): `Interceptor`

Defined in: [method-filter.ts:130](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/interceptors/src/method-filter.ts#L130)

Create a method filter interceptor that routes to per-method interceptors
based on wildcard pattern matching.

Resolution order (all matching patterns execute):
1. Global wildcard `"*"` (executed first)
2. Service wildcard `"Service/*"` (executed second)
3. Exact match `"Service/Method"` (executed last)

Within each pattern, interceptors execute in array order.

## Parameters

### methods

[`MethodFilterMap`](../../@connectum/interceptors/type-aliases/MethodFilterMap.md)

Method pattern to interceptors mapping

## Returns

`Interceptor`

ConnectRPC interceptor

## Examples

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

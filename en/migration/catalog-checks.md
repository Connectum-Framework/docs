---
title: Service Catalog Checks
description: From 1.3.0, catalog calls and catalog configuration refuse mistakes that used to be accepted, and a missing remoteResolver on ctx.call is FailedPrecondition instead of Unavailable.
docType: migration
---

# Service Catalog Checks

> Applies to `@connectum/core` 1.3.0.

## Does this apply to you?

You need to act only if one of these is true:

- code matches `Code.Unavailable` on a `ctx.call` or `ctx.stream` to a service that is **not mounted locally on a server that has no `remoteResolver`**;
- you pass `timeoutMs` of `0`, a negative number, `NaN` or `Infinity` in `CallOptions`;
- `propagateHeaders` holds a name that is not a valid HTTP header name, or is not an array;
- `enabledServices` holds a type name that is not in `services` (for example a typo read from an environment variable);
- your `catalog` is a hand-built map whose key differs from its descriptor's `typeName`;
- you call `createCatalogClient()` without a `resolver`, `dnsResolver()` without a `template`, or pass a non-object map to `perServiceEnvResolver()` or `mapResolver()`;
- you define the same service twice, or a handler object has a member that is not a function, or a `defineLazyService` factory is `async` or returns something that is not an object.

Valid configurations behave as before.

## What changed

| Case | Before | From 1.3.0 |
|---|---|---|
| `ctx.call` / `ctx.stream` to an unmounted service, no `remoteResolver` | `Code.Unavailable`, "the resolver returned null" | `Code.FailedPrecondition`, "not mounted locally and no remoteResolver is configured" |
| `CallOptions.timeoutMs` of `0`, negative, `NaN`, `Infinity` | `0` and negatives removed the inherited deadline; the others failed differently locally and remotely | Rejected with `Code.InvalidArgument` naming `timeoutMs` |
| Nested call after the inbound deadline passed | The callee ran without a deadline | `Code.DeadlineExceeded` |
| Invalid `propagateHeaders` entry | `createServer()` succeeded; every `ctx.call` threw a `TypeError` | `createServer()` throws a `TypeError` naming `propagateHeaders` and the entry |
| `enabledServices` entry that matches no supplied service | The server started with nothing mounted | `start()` rejects with `CatalogConfigError` |
| Catalog key different from the `typeName` | Accepted | `createServer()` / `createCatalogClient()` throw `CatalogConfigError` |
| Resolver returns a string, `undefined` or a `Promise` | `transport.unary is not a function` on every call; the value was cached | `Code.Internal` naming the service; not cached |
| Same service defined twice | The last definition won silently | `CatalogConfigError` |
| `defineService` / `defineLazyService` handler mistakes | Late or unnamed errors, or a service whose methods were all `unimplemented` | `TypeError` naming the service |
| `endpoint: ""` | The resolver saw `{ typeName, endpoint: "" }` or `{ typeName }` depending on call order | Always `{ typeName }` |
| `server.hasService()` on a lazy service | Ran the factory and froze `addService()` | A lookup; nothing runs |

## Required changes

- **Match the code that fits the cause.** For a missing `remoteResolver` handle `Code.FailedPrecondition` (or better, configure the resolver or mount the service). Keep `Code.Unavailable` for a configured resolver that returns `null`.
- **Drop non-positive timeouts.** Omit `timeoutMs` to inherit the deadline, or pass a positive finite number to shorten it.
- **Fix the names.** Correct the header names, `enabledServices` entries and catalog keys the errors point at.
- **Make factories synchronous.** A `defineLazyService` factory returns the handlers object; do asynchronous setup before `createServer()`.

## Before and after

```typescript
const server = createServer({
  services: [orders],
  catalog,
  enabledServices: [OrdersService.typeName],
  // no remoteResolver
});

// 1.2: ctx.call('inventory.v1.InventoryService/Check', ...) -> Code.Unavailable (retried by `retry`)
// 1.3: ctx.call('inventory.v1.InventoryService/Check', ...) -> Code.FailedPrecondition
```

## Verify the upgrade

Start every server configuration you deploy, including the one that reads `enabledServices` from the environment. `start()` and `createServer()` now report the mistakes above before the first request.

## Related

- [Service catalog](/en/guide/service-communication/service-catalog#error-model)
- [Resolvers](/en/guide/service-communication/resolvers)

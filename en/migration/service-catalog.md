---
title: Migrating to the Service Catalog
description: Adopt defineService, the remoteResolver, and ctx.call — and the breaking removal of ServiceRoute and server.client fallback
---

# Migrating to the Service Catalog

> Applies to 1.0.0.

1.0.0 replaces the ad-hoc service-registration and cross-service-call wiring with a
**service catalog**: services are declared with `defineService`, remote routing is
configured once with a `remoteResolver`, and handlers make typed cross-service calls
through `ctx.call`. Two old shapes are **removed** in the same release:

- the `ServiceRoute` registration callback (`(router) => void`), and
- the per-call `fallback` transport on `server.client(Desc, { fallback })`.

This is a compiling breaking change: the removed types no longer exist, so a project
that uses them will fail to type-check until migrated. Migration is currently
**manual** — automated codemods are tracked as a separate, future change.

## 1. `ServiceRoute` → `defineService`

A service is now a `{ descriptor, register }` pair produced by `defineService`
(descriptor + handler map), instead of an opaque router callback. Keeping the proto
descriptor alongside the handlers lets the framework build the catalog, drive local
vs remote activation, and validate the transport.

**Before**

```typescript
import { createServer } from '@connectum/core';
import { GreeterService } from './gen/greeter_pb.js';

const routes = (router) => {
  router.service(GreeterService, {
    async sayHello(req, ctx) {
      return { message: `Hello, ${req.name}!` };
    },
  });
};

const server = createServer({ services: [routes] });
```

**After**

```typescript
import { createServer, defineService } from '@connectum/core';
import { GreeterService } from './gen/greeter_pb.js';

const greeter = defineService(GreeterService, {
  async sayHello(req, ctx) {
    return { message: `Hello, ${req.name}!` };
  },
});

const server = createServer({ services: [greeter] });
```

Handlers now receive a Connectum `Context` (a superset of the raw ConnectRPC
`HandlerContext` that adds `ctx.call` and `ctx.stream`). Existing handlers that read
`ctx.signal`, `ctx.timeoutMs()`, `ctx.requestHeader`, `ctx.values`, etc. keep working
unchanged — every `HandlerContext` field is forwarded.

For DI-heavy services whose handlers are expensive to construct, use
`defineLazyService(descriptor, factory)`. The `factory` runs only when the service is
actually mounted locally (i.e. listed in `enabledServices`, covered below), so a
service routed to a remote process never instantiates its local dependencies.

```typescript
import { defineLazyService } from '@connectum/core';

const orders = defineLazyService(OrdersService, () => createOrdersHandlers(deps));
```

### Per-service options (interceptors, `jsonOptions`)

The third argument of `router.service(Descriptor, impl, options)` — a per-service
option bag applied to every method of that service — is preserved as the optional
third argument of `defineService` (and `defineLazyService`), typed as
`ServiceOptions`. So a service-scoped interceptor chain or `jsonOptions` migrates
one-to-one.

**Before**

```typescript
const routes = (router) => {
  router.service(GreeterService, handlers, { interceptors: [requireAuth] });
};
```

**After**

```typescript
import { defineService } from '@connectum/core';

const greeter = defineService(GreeterService, handlers, {
  interceptors: [requireAuth],
});
```

`ServiceOptions` is exactly `@connectrpc/connect`'s `router.service` option bag, so
`jsonOptions` and the other per-service handler options carry over unchanged.

A pure local monolith needs nothing else — no catalog, no resolver.

## 2. `server.client(Desc, { fallback })` → `remoteResolver`

The per-call `fallback` transport is removed. `ServerClientOptions` no longer has a
`fallback` field (it now carries only an optional `endpoint` hint for polymorphic
deployments). Instead, configure routing **once** on the server with a
`remoteResolver`, and `server.client(Desc)` auto-routes: in-process for locally
mounted services, resolver-supplied transport for everything else.

**Before**

```typescript
import { createGrpcTransport } from '@connectrpc/connect-node';

const remoteTransport = createGrpcTransport({ baseUrl: 'https://inventory.internal' });

// A manual fallback transport, repeated at every call site:
const client = server.client(InventoryService, { fallback: remoteTransport });
await client.checkStock({ sku });
```

**After**

```typescript
import { createServer, singleTransportResolver } from '@connectum/core';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { serviceCatalog } from './gen/catalog.js';

const server = createServer({
  services: [orders],                       // OrdersService is local
  catalog: serviceCatalog,                  // generated: typeName → DescService
  enabledServices: ['shop.v1.OrdersService'],
  remoteResolver: singleTransportResolver(
    createGrpcTransport({ baseUrl: 'https://inventory.internal' }),
  ),
});

// Same call site whether InventoryService is co-located or remote:
const client = server.client(InventoryService);
await client.checkStock({ sku });
```

Pick the resolver that matches your topology — all four are exported from
`@connectum/core` and must be synchronous (no network I/O; the framework caches the
result per `(typeName, endpoint)`):

- `singleTransportResolver(transport)` — route every remote service to one upstream
  (a sidecar or gateway).
- `mapResolver({ [typeName]: transport })` — an explicit allow-list; unknown
  `typeName`s resolve to `null` (→ `Code.Unavailable`).
- `dnsResolver({ template })` — derive a base URL per service from a DNS-style
  template, e.g. `'http://{shortName}.prod.svc.cluster.local:50051'`.
- `perServiceEnvResolver({ [typeName]: 'ENV_VAR' })` — read each service's base URL
  from its own environment variable.

The `catalog` is generated by `protoc-gen-catalog` (a `{ typeName → DescService }`
map). It drives startup validation and remote routing; it is also what makes
`ctx.call` typed (see below).

## 3. Manual `createClient` in handlers → `ctx.call`

Cross-service calls from inside a handler no longer require hand-wiring a transport and
a generated client. Call `ctx.call("${typeName}/${Method}", req)` instead — it is typed
by the generated catalog and automatically cascades the inbound abort signal and
deadline (a caller may shorten the deadline but never extend it).

**Before**

```typescript
import { createClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { InventoryService } from './gen/inventory_pb.js';

const inventoryTransport = createGrpcTransport({ baseUrl: process.env.INVENTORY_URL });

const orders = defineService(OrdersService, {
  async placeOrder(req, ctx) {
    const inventory = createClient(InventoryService, inventoryTransport);
    // Manual signal/deadline plumbing per call:
    const stock = await inventory.checkStock({ sku: req.sku }, { signal: ctx.signal });
    // ...
  },
});
```

**After**

```typescript
const orders = defineService(OrdersService, {
  async placeOrder(req, ctx) {
    // Typed by the generated catalog; signal + deadline cascade automatically.
    const stock = await ctx.call('shop.v1.InventoryService/CheckStock', { sku: req.sku });
    // ...
  },
});
```

The method key is `"${typeName}/${Method}"` where `Method` is the PascalCase proto
method name (e.g. `"shop.v1.InventoryService/CheckStock"`), matching the ConnectRPC URL
convention. For streaming methods, use `ctx.stream(...)` instead of `ctx.call(...)`.

`ctx.call` requires a `catalog` on the server — without one it throws
`ConnectError(Code.FailedPrecondition)`. Without the generated catalog augmentation the
key type is `never`, so `ctx.call` is statically uncallable — the correct default for a
service that makes no cross-service calls.

## 4. Manual env→endpoint registry → `parseServicesEnv` + a resolver

Two distinct env-driven concerns, previously hand-rolled in boot code, are now first
class. Do not conflate them:

- **Which services this process hosts locally** — `parseServicesEnv` turns a
  comma-separated env value into the `enabledServices` list (full proto `typeName`s).
- **Where to reach remote services** — `perServiceEnvResolver` maps each remote
  `typeName` to the env var holding its base URL.

**Before**

```typescript
// Hand-rolled: parse env, build a registry, look up per call.
const REGISTRY = {
  'shop.v1.InventoryService': process.env.INVENTORY_URL,
  'shop.v1.PaymentService': process.env.PAYMENT_URL,
};
```

**After**

```typescript
import { createServer, parseServicesEnv, perServiceEnvResolver } from '@connectum/core';
import { serviceCatalog } from './gen/catalog.js';

const server = createServer({
  services: [orders, inventory],
  catalog: serviceCatalog,
  // CONNECTUM_SERVICES="shop.v1.OrdersService,shop.v1.InventoryService"
  enabledServices: parseServicesEnv(process.env.CONNECTUM_SERVICES),
  remoteResolver: perServiceEnvResolver({
    'shop.v1.PaymentService': 'PAYMENT_URL',
  }),
});
```

A service listed in `enabledServices` is mounted locally; anything else in the catalog
is treated as remote and resolved by the `remoteResolver`. A `perServiceEnvResolver`
mapping with no entry, or whose env var is unset, resolves to `null`
(→ `Code.Unavailable`).

## 5. Error handling: configuration vs operational failures

1.0.0 splits errors by cause, so a programmer mistake fails loud rather than being
mapped to an RPC status:

- **Configuration mistake** → `CatalogConfigError` (a plain `Error` with a stack), thrown
  eagerly. `server.client(Desc)` for a service that is **not** mounted locally **and**
  has **no** `remoteResolver` configured throws `CatalogConfigError` at the
  `server.client(...)` call — not later, at dispatch. `enabledServices` entries absent
  from the catalog throw `CatalogConfigError` at `server.start()`.
- **Operational failure** → `ConnectError` with a meaningful `Code`. A resolver that
  returns `null` (no route) surfaces as `ConnectError(Code.Unavailable)`.

```typescript
// Not mounted locally AND no remoteResolver → configuration error, thrown here:
const client = server.client(PaymentService); // throws CatalogConfigError

// With a remoteResolver that returns null for this service → operational error:
const client = server.client(PaymentService); // throws ConnectError(Code.Unavailable)
```

Catch `CatalogConfigError` only in tooling/tests; in normal operation it should crash
the process so the misconfiguration is fixed, not swallowed.

## Migration checklist

- [ ] Replace every `(router) => { router.service(...) }` callback with
      `defineService(Descriptor, handlers)`.
- [ ] Switch DI-heavy services to `defineLazyService(Descriptor, factory)` where the
      factory should run only when the service is mounted locally.
- [ ] Remove `fallback` from all `server.client(Desc, { ... })` call sites.
- [ ] Configure a single `remoteResolver` on `createServer({ ... })`
      (`singleTransportResolver` / `mapResolver` / `dnsResolver` /
      `perServiceEnvResolver`).
- [ ] Pass the generated `catalog` to `createServer` if any process makes
      cross-service calls or routes to remote services.
- [ ] Replace in-handler `createClient(Svc, transport)` with
      `ctx.call("${typeName}/${Method}", req)` (and `ctx.stream(...)` for streaming).
- [ ] Replace hand-rolled env registries with `parseServicesEnv` (local activation) and
      a resolver (remote endpoints).
- [ ] Handle the split error model: expect `CatalogConfigError` for misconfiguration and
      `ConnectError(Code.Unavailable)` for an unresolvable remote service.

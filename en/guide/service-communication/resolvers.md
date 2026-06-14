---
outline: deep
---

# Remote Resolvers

A **remote resolver** is the service-catalog routing layer: it maps a proto service identity to the `Transport` used to reach that service when it is *not* mounted on the local server. The unified client factory (`server.client(Desc)`) and the catalog primitive (`ctx.call(...)`) both consult it — locally-mounted services dispatch in-process and never touch the resolver, everything else is resolved through it.

You configure one resolver per server via `createServer({ remoteResolver })`. The framework calls it lazily, on the first route to a given service, and caches the result.

## The `RemoteResolver` contract

A resolver is a plain function:

```typescript
import type { RemoteResolver, ResolverContext } from '@connectum/core';

// (ctx: { typeName: string; endpoint?: string }) => Transport | null
const resolver: RemoteResolver = ({ typeName, endpoint }) => {
  // map service identity → Transport, or null
};
```

`ResolverContext` carries the proto `typeName` (e.g. `"orders.v1.OrdersService"`) and an optional `endpoint` hint (see [Endpoint hints](#endpoint-hints)).

The contract is strict:

- **Synchronous.** The signature returns `Transport | null` directly — never a `Promise`. The framework caches per `(typeName, endpoint)` and cannot await a resolver.
- **No network I/O.** A resolver must not dial TCP or perform a DNS lookup. It only *maps an identity to a lazily-connecting transport*. ConnectRPC transports (e.g. `createGrpcTransport({ baseUrl })`) do not open a socket until the first RPC, which is exactly what makes a synchronous, I/O-free resolver safe — startup validation never blocks on DNS or a dial.
- **`null` means "no route."** Returning `null` is an operational miss: the call fails with `Code.Unavailable` at call time. (A *missing* `remoteResolver` for a non-local `server.client()` is a different, configuration-time failure — `CatalogConfigError`.)
- **Cached per `(typeName, endpoint)`.** The resolver runs at most once per unique route; the resolved transport is reused for every subsequent call.

## Built-in resolvers

`@connectum/core` ships four resolver factories covering the common deployment shapes.

### `singleTransportResolver(transport)`

Routes **every** remote service to the same transport. Ideal for a single upstream — a sidecar or an API gateway — that fronts all remote services, and for local development where one process holds everything.

```typescript
import { createServer, singleTransportResolver } from '@connectum/core';
import { createGrpcTransport } from '@connectrpc/connect-node';

const gateway = createGrpcTransport({ baseUrl: 'http://gateway:50051' });

const server = createServer({
  services: [myRoutes],
  remoteResolver: singleTransportResolver(gateway),
});
```

### `mapResolver({ [typeName]: transport })`

An explicit per-service map. Use it when each remote service has its own transport and you want an exact allow-list — any `typeName` not in the map resolves to `null` (→ `Code.Unavailable`).

```typescript
import { createServer, mapResolver } from '@connectum/core';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { OrdersService } from '#gen/orders/v1/orders_pb.js';
import { InventoryService } from '#gen/inventory/v1/inventory_pb.js';

const server = createServer({
  services: [myRoutes],
  remoteResolver: mapResolver({
    [OrdersService.typeName]: createGrpcTransport({ baseUrl: 'http://orders:50051' }),
    [InventoryService.typeName]: createGrpcTransport({ baseUrl: 'http://inventory:50051' }),
  }),
});
```

### `dnsResolver(options)`

Derives a base URL per service from a DNS-style template, then builds a transport for it. This mirrors container/Kubernetes service-name routing, where the service identity *is* its DNS name.

`DnsResolverOptions`:

| Field | Type | Description |
|-------|------|-------------|
| `template` | `string` | URL template with `{shortName}` (alias `{name}`) placeholders. |
| `createTransport?` | `(baseUrl: string) => Transport` | Builds a transport from the resolved URL. Defaults to a gRPC (HTTP/2) transport via `createGrpcTransport({ baseUrl })`. |

The **short name** is the last dot-segment of the `typeName`, lower-cased, with a trailing `Service` stripped — `orders.v1.OrdersService` becomes `orders`. Both `{shortName}` and `{name}` expand to the same value.

```typescript
import { createServer, dnsResolver } from '@connectum/core';

const server = createServer({
  services: [myRoutes],
  remoteResolver: dnsResolver({
    template: 'http://{shortName}.prod.svc.cluster.local:50051',
  }),
});
```

`dnsResolver` **always resolves** — it never returns `null`, because the template is assumed to cover every remote service. If you need an explicit allow-list (unknown services rejected as `Unavailable`), use `mapResolver` instead.

### `perServiceEnvResolver(map, options?)`

Reads each service's base URL from an environment variable. `map` pairs each `typeName` with the *name* of the env var holding its URL. This replaces hand-rolled env registries in boot code.

`PerServiceEnvResolverOptions`:

| Field | Type | Description |
|-------|------|-------------|
| `createTransport?` | `(baseUrl: string) => Transport` | Builds a transport from the resolved URL. Defaults to a gRPC (HTTP/2) transport. |

A service with no mapping, or whose env var is unset or empty, resolves to `null` (→ `Code.Unavailable`).

```typescript
import { createServer, perServiceEnvResolver } from '@connectum/core';
import { OrdersService } from '#gen/orders/v1/orders_pb.js';

// Reads process.env.ORDERS_URL at resolve time.
const server = createServer({
  services: [myRoutes],
  remoteResolver: perServiceEnvResolver({
    [OrdersService.typeName]: 'ORDERS_URL',
  }),
});
```

## Endpoint hints

For services reachable at several endpoints (multi-region, blue/green, or a tenant-specific upstream), pass an opaque `endpoint` hint. It is forwarded to the resolver as `ctx.endpoint` and is part of the cache key, so distinct endpoints resolve to distinct cached transports. The hint is **ignored for locally-mounted services**.

From the unified client factory (`ServerClientOptions`):

```typescript
const ordersEu = server.client(OrdersService, { endpoint: 'eu-west' });
const ordersUs = server.client(OrdersService, { endpoint: 'us-east' });
```

From inside a handler (`CallOptions`):

```typescript
const inner = await ctx.call(
  'orders.v1.OrdersService/GetOrder',
  create(GetOrderRequestSchema, { id }),
  { endpoint: 'eu-west' },
);
```

Your resolver decides what the hint means:

```typescript
const regional: RemoteResolver = ({ typeName, endpoint }) => {
  const region = endpoint ?? 'eu-west';
  const shortName = typeName.split('.').pop()!.replace(/Service$/, '').toLowerCase();
  return createGrpcTransport({ baseUrl: `http://${shortName}.${region}.svc:50051` });
};
```

## Composing resolvers

A resolver returning `null` is the natural delegation signal: write a composite that tries each resolver in order and takes the first non-null result. Because resolvers are synchronous, the composite is a plain loop.

```typescript
import type { RemoteResolver } from '@connectum/core';

/** Try each resolver in order; first non-null wins, null if all miss. */
function fallback(...resolvers: RemoteResolver[]): RemoteResolver {
  return (ctx) => {
    for (const resolve of resolvers) {
      const transport = resolve(ctx);
      if (transport) return transport;
    }
    return null;
  };
}

// Explicit overrides first, DNS convention as the catch-all.
const server = createServer({
  services: [myRoutes],
  remoteResolver: fallback(
    mapResolver({ [OrdersService.typeName]: ordersOverride }),
    dnsResolver({ template: 'http://{shortName}.prod.svc.cluster.local:50051' }),
  ),
});
```

Order `dnsResolver` last in such a chain — it always resolves, so any resolver after it is unreachable.

## Testing with mocks

`@connectum/testing` (not `@connectum/core`) provides a resolver and a context helper for serving canned, in-process responses with no network hop.

`mockResolver([mockService(Service, impl)])` builds a `RemoteResolver` that serves each mocked service in-process and returns `null` for anything not mocked — so it composes with real resolvers via the `null`-fallback pattern above. Every mock response carries the response header `MOCK_RESPONSE_HEADER` (`"x-connectum-mock"`) set to `"true"`, so a test can prove the call was served by a mock rather than a real transport.

```typescript
import { create } from '@bufbuild/protobuf';
import { createServer } from '@connectum/core';
import { mockResolver, mockService, MOCK_RESPONSE_HEADER } from '@connectum/testing';
import { InventoryService, StockSchema } from '#gen/inventory/v1/inventory_pb.js';

const server = createServer({
  services: [],
  remoteResolver: mockResolver([
    mockService(InventoryService, {
      getStock: () => create(StockSchema, { units: 7 }),
    }),
  ]),
});

// The mock tag is a *response header*. Read it via the connect client's
// header hook — ctx.call surfaces only the message, not headers.
const client = server.client(InventoryService);
let servedByMock: string | null = null;
const stock = await client.getStock(
  create(GetStockRequestSchema, { sku: 'x' }),
  { onHeader: (h) => { servedByMock = h.get(MOCK_RESPONSE_HEADER); } },
);
// servedByMock === 'true'; stock.units === 7
```

To unit-test a handler's `ctx.call` / `ctx.stream` logic in isolation, `createMockContext({ catalog, mocks })` builds a `Context` that drives the **same** dispatch path as a live request (a real `Server` is constructed with a `mockResolver`), so resolver lookup, cascade injection, interceptor composition, and error semantics all match production.

```typescript
import { create } from '@bufbuild/protobuf';
import { defineCatalog } from '@connectum/core';
import { createMockContext, mockService } from '@connectum/testing';
import { InventoryService, StockSchema } from '#gen/inventory/v1/inventory_pb.js';
import { CreateOrderSchema } from '#gen/orders/v1/orders_pb.js';

const ctx = createMockContext({
  catalog: defineCatalog({ [InventoryService.typeName]: InventoryService }),
  mocks: [
    mockService(InventoryService, {
      getStock: () => create(StockSchema, { units: 7 }),
    }),
  ],
});

// Drive the handler directly with the mock context.
const res = await orderHandler(create(CreateOrderSchema, { sku: 'x' }), ctx);
```

`CreateMockContextOptions` also accepts `outgoingInterceptors`, `requestHeader`, `timeoutMs`, and `propagateHeaders` to reproduce production header propagation and the deadline cascade.

## Kubernetes, Istio, and service meshes

`dnsResolver` covers Docker Compose and Kubernetes service discovery directly: the template points at the service's DNS name (`http://{shortName}.<namespace>.svc.cluster.local:<port>`), and Kubernetes resolves it to the service's cluster IP. No external service registry is required.

When a mesh (Istio, Linkerd) or an Envoy sidecar is present, routing and mTLS are handled transparently at the sidecar — the resolver still just points at the local service DNS name, and the sidecar intercepts the connection to apply load balancing, retries, and certificate-based identity. The resolver layer does not change between a plain Kubernetes deployment and a meshed one.

## Related

- [Communication Patterns](./patterns) -- request-response, fan-out, streaming
- [Service Communication](/en/guide/service-communication) -- overview, transport configuration, service discovery
- [Client Interceptors](./client-interceptors) -- OTel, resilience, circuit breaker configuration
- [@connectum/core API](/en/api/@connectum/core/) -- full API reference

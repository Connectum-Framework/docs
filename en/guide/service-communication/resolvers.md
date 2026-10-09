---
title: Route Remote Service Calls
description: Resolve proto services to remote transports for catalog calls.
docType: how-to
outline: deep
---

# Remote Resolvers

A **remote resolver** is the service-catalog routing layer: it maps a proto service identity to the `Transport` used to reach that service. Three APIs consult it: the unified client factory (`server.client(Desc)`), the catalog primitive (`ctx.call(...)`), and the standalone catalog client (`createCatalogClient(...)`). For the first two, locally-mounted services dispatch in-process and never touch the resolver; everything else is resolved through it. `createCatalogClient` has no local server, so every call goes through the resolver unconditionally. The server's `outgoingInterceptors` run on every route the resolver returns; a standalone client applies its own `outgoingInterceptors` option.

You pass a resolver to `createServer({ remoteResolver })` for server-side routing, or directly to `createCatalogClient({ resolver })` for out-of-process workers, schedulers, and CLIs. The framework calls it lazily, on the first route to a given service, and caches the result.

## The `RemoteResolver` contract

A resolver is a plain function:

```typescript
import type { RemoteResolver } from '@connectum/core';
import { createGrpcTransport } from '@connectrpc/connect-node';

// (ctx: { typeName: string; endpoint?: string }) => Transport | null
const resolver: RemoteResolver = ({ typeName, endpoint }) => {
  if (typeName !== 'orders.v1.OrdersService' || endpoint !== 'eu-west') return null;
  return createGrpcTransport({ baseUrl: 'https://orders.example.com:8443' });
};
```

`ResolverContext` carries the proto `typeName` (e.g. `"orders.v1.OrdersService"`) and an optional `endpoint` hint (see [Endpoint hints](#endpoint-hints)).

The contract is strict:

- **Synchronous.** The signature returns `Transport | null` directly — never a `Promise`. The framework caches per `(typeName, endpoint)` and cannot await a resolver.
- **No network I/O.** A resolver must not dial TCP or perform a DNS lookup. It only *maps an identity to a lazily-connecting transport*. ConnectRPC transports (e.g. `createGrpcTransport({ baseUrl })`) do not open a socket until the first RPC, which is exactly what makes a synchronous, I/O-free resolver safe — startup validation never blocks on DNS or a dial.
- **`null` means "no route."** Returning `null` is an operational miss: the call fails with `Code.Unavailable` — at dispatch time for `ctx.call`, and eagerly at client construction for `server.client()`. (A *missing* `remoteResolver` for a non-local `server.client()` is a different, configuration-time failure — `CatalogConfigError`.)
- **Successful resolutions are cached per `(typeName, endpoint)`.** Once a route
  returns a transport, subsequent calls reuse it. A `null` result or a thrown
  error is not cached, so the next attempt consults the resolver again.

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
import { InventoryService, GetStockRequestSchema, StockSchema } from '#gen/inventory/v1/inventory_pb.js';

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

`CreateMockContextOptions` also accepts `outgoingInterceptors`, `requestHeader`, `timeoutMs`, and `propagateHeaders` to reproduce production header propagation and the deadline cascade. The chain runs on mock routes exactly as on resolver routes; an interceptor that tags the transport kind (such as the OpenTelemetry client interceptor) observes a mock route as `http`.

## Transport-owned vs application-owned interceptors

The server's `outgoingInterceptors` own application policy: identity (a bearer signer), tracing (the OpenTelemetry client interceptor), and resilience (retry). They run once per call on every route, outside the interceptors of the transport the resolver returns, so the call's deadline budget starts before them and the transport receives the remaining budget.

The transport the resolver returns owns transport-specific middleware only: TLS and client certificates, compression, and a header that only one upstream understands. The framework cannot look inside a `Transport`, so it cannot detect or remove a policy you configured in both places; the policy simply runs twice (two client spans, two token-factory calls, retry amplification). If you decorated resolver transports with a signer or tracing interceptor to make remote routes work before 1.3.0, remove that copy — see [section 6 of the migration guide](/en/migration/service-catalog).

Two things differ from a chain mounted on a transport. An interceptor in `outgoingInterceptors` sees `req.url` as `https://catalog/<typeName>/<Method>`, `requestMethod: "POST"`, and none of the protocol headers (`content-type`, `connect-timeout-ms`), because a `Transport` does not expose its address and adds those itself; it also cannot see the transport's `defaultTimeoutMs` when it passes no `timeoutMs`. Policy that needs the wire request — signing over headers, an audience derived from the host — belongs on the resolver's transport, whose own interceptors see the real request.

## Kubernetes, Istio, and service meshes

`dnsResolver` covers Docker Compose and Kubernetes service discovery directly: the template points at the service's DNS name (`http://{shortName}.<namespace>.svc.cluster.local:<port>`), and Kubernetes resolves it to the service's cluster IP. No external service registry is required.

When a mesh (Istio, Linkerd) or an Envoy sidecar is configured to intercept the
connection, it can handle routing and mTLS according to its policies. The
resolver can still point at the service DNS name; the resolver itself does not
configure mesh identity, retries, or certificates.

For direct TLS, resolve an `https://` URL and configure client trust and
certificates on the transport returned by your `createTransport` factory.
`createServer({ tls })` configures inbound connections and does not configure
the resolver's outgoing transport. Follow [TLS](/en/guide/security/tls) and
[mTLS](/en/guide/security/mtls) for the client and server settings.

## Related

- [Communication Patterns](./patterns) -- request-response, fan-out, streaming
- [Service Communication](/en/guide/service-communication) -- overview, transport configuration, service discovery
- [Client Interceptors](./client-interceptors) -- OTel, resilience, circuit breaker configuration
- [@connectum/core API](/en/api/@connectum/core/) -- full API reference

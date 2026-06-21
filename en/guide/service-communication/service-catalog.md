---
outline: deep
---

# Service Catalog

The **service catalog** turns cross-service calls into a single declarative primitive. Instead of constructing a transport and a client at every call site, a handler writes `ctx.call(...)` (or `ctx.stream(...)`) and the framework chooses the transport for you: an **in-process** call when the target service is mounted locally, a **remote** call (via a resolver) when it lives in another process. The call site never changes — split a service out of a monolith and the same `ctx.call` line keeps working.

A catalog is a plain readonly map of proto `typeName → DescService`. It carries **no topology**: what is local versus remote is decided at boot by `enabledServices` and a `remoteResolver`, never baked into the proto. The catalog exists to do two jobs — make `ctx.call` / `ctx.stream` **fully typed**, and let the server **resolve** a target to a transport.

## Defining services

Register a service with `defineService(descriptor, handlers)`. Each handler receives a Connectum `Context` as its second argument. `Context` extends ConnectRPC's `HandlerContext` — every field you already know (`signal`, `timeoutMs()`, `requestHeader`, `values`, …) is still there — and adds `ctx.call` and `ctx.stream`.

```typescript
import { create } from '@bufbuild/protobuf';
import { defineService } from '@connectum/core';
import { OrdersService, CreateOrderResponseSchema } from './gen/orders/v1/orders_pb.js';
import { ReserveRequestSchema } from './gen/inventory/v1/inventory_pb.js';

const orders = defineService(OrdersService, {
  async createOrder(req, ctx) {
    // Cross-service call — local or remote is decided by the framework.
    const reservation = await ctx.call(
      'inventory.v1.InventoryService/Reserve',
      create(ReserveRequestSchema, { sku: req.sku, quantity: req.quantity }),
    );
    return create(CreateOrderResponseSchema, { orderId: reservation.orderId });
  },
});
```

`defineService` returns a `ServiceDefinition` (`{ descriptor, register }`) that you pass to `createServer({ services })`.

`defineLazyService(descriptor, factory)` is the same, but `factory()` runs **only when the service is actually mounted locally** — i.e. when its `typeName` is in `enabledServices` (or `enabledServices` is `undefined`). A service routed to a remote process never instantiates its local dependencies, which is useful for DI-heavy monoliths where wiring a service is expensive.

## Configuring the catalog

Pass the catalog to `createServer({ catalog })`. The catalog drives startup validation and remote routing. It is **optional** — a process that hosts everything locally and makes no cross-service calls needs none of these fields.

```typescript
import { createServer, defineCatalog } from '@connectum/core';
import { OrdersService } from './gen/orders/v1/orders_pb.js';
import { InventoryService } from './gen/inventory/v1/inventory_pb.js';

const catalog = defineCatalog({
  [OrdersService.typeName]: OrdersService,
  [InventoryService.typeName]: InventoryService,
});

const server = createServer({
  services: [orders],
  catalog,
});
```

`defineCatalog` freezes the record and preserves the literal key type for inference. `mergeCatalogs(...catalogs)` combines several catalogs into one (handy in a polyrepo); it throws `CatalogConfigError` on a duplicate `typeName`.

### Generating the catalog

Writing the catalog and its type augmentations by hand is tedious and drifts from proto. The `@connectum/protoc-gen-catalog` buf plugin generates a `catalog.gen.ts` per buf module containing both the runtime `serviceCatalog` object and the type augmentations.

```yaml
# buf.gen.yaml
version: v2
plugins:
  - local: protoc-gen-es
    out: gen
    opt: [target=ts, import_extension=.js]
  - local: protoc-gen-connectum-catalog
    out: gen
    opt: [target=ts, import_extension=.js]
```

The generated file augments `@connectum/core`'s `ConnectumCallMap` (one entry per unary RPC) and `ConnectumStreamMap` (one per streaming RPC), keying each `"<typeName>/<Method>"` to its request/response types:

```typescript
// catalog.gen.ts (generated — DO NOT EDIT)
import type {} from '@connectum/core';
import { GreeterService } from './greeter_pb.js';
import type { SayHelloRequest, SayHelloResponse } from './greeter_pb.js';

export const serviceCatalog = {
  'greeter.v1.GreeterService': GreeterService,
} as const;

declare module '@connectum/core' {
  interface ConnectumCallMap {
    'greeter.v1.GreeterService/SayHello': { request: SayHelloRequest; response: SayHelloResponse };
  }
  interface ConnectumStreamMap {}
}
```

::: warning The generated file must be loaded
The `declare module` augmentation is types-only and is **erased** unless something imports the file. Re-export it from your contracts package's `index.ts`, or add a top-level `import './catalog.gen.js';`. Without it, consumers silently see `keyof ConnectumCallMap` as `never` and `ctx.call` becomes uncallable. Keep the mandatory `import type {} from '@connectum/core';` line — it lets the augmentation merge across packages.
:::

With no augmentation, `keyof ConnectumCallMap` is `never`, so `ctx.call` is statically uncallable — the right default for a service that makes no cross-service calls.

## Unary calls — `ctx.call`

```typescript
const response = await ctx.call(method, request, options?);
```

`method` is a `"${typeName}/${Method}"` key. **Note the casing:** the key uses the proto method name (PascalCase, e.g. `.../SayHello`), which is distinct from the camelCase handler name (`sayHello`). `request` is the request message; build it with `create(Schema, { ... })`. The return is a `Promise<response>`.

The transport is chosen automatically: an in-process call when the target is mounted locally (proven by the in-process dispatch — no TCP socket is opened), otherwise the transport supplied by the configured `remoteResolver`. Resolved remote transports are cached per `(typeName, endpoint)` so the resolver runs at most once per route.

```typescript
async secureEcho(req, ctx) {
  const inner = await ctx.call(
    'inventory.v1.InventoryService/CheckStock',
    create(CheckStockRequestSchema, { sku: req.sku }),
  );
  return create(EchoResponseSchema, { available: inner.available });
}
```

## Streaming calls — `ctx.stream`

`ctx.stream(method)` is **curried**: it returns a kind-specific factory, then you call that factory. The shape depends on the streaming kind recorded in `ConnectumStreamMap`.

**Server-streaming** → factory takes the request and returns an `AsyncIterable`:

```typescript
for await (const item of ctx.stream('streaming.v1.StreamingService/Server')(
  create(ItemSchema, { value: req.message, sequence: 3 }),
)) {
  // consume item
}
```

**Client-streaming** → factory returns a `ClientStreamHandle`: `send()` N requests, then `close()` resolves the single aggregated response:

```typescript
const handle = ctx.stream('streaming.v1.StreamingService/Client')();
handle.send(create(ItemSchema, { value: 'a', sequence: 0 }));
handle.send(create(ItemSchema, { value: 'b', sequence: 1 }));
const count = await handle.close(); // Promise<Res>
```

**Bidi-streaming** → factory returns a `BidiStreamHandle`: `send()` requests while iterating `responses`; `close()` ends **only** the request (send) half — the response half keeps yielding until the server completes:

```typescript
const handle = ctx.stream('streaming.v1.StreamingService/Bidi')();
handle.send(create(ItemSchema, { value: 'a', sequence: 0 }));
handle.send(create(ItemSchema, { value: 'b', sequence: 1 }));
handle.close(); // void — ends the send half only
for await (const item of handle.responses) {
  // consume server responses
}
```

On a **mid-stream transport failure** the iterator follows a **deliver-then-error** policy: it delivers the messages received so far, then throws the terminal `ConnectError`. Consumers that `break` early do not hang.

## Cascade behaviour (`CallOptions`)

`ctx.call(method, request, options?)` accepts an optional `CallOptions` as its third argument. `ctx.stream(method)` takes only the method key and returns a factory — pass `CallOptions` to that returned factory, not to `ctx.stream` itself (e.g. `ctx.stream(method)(request, options)` for server-streaming, or `ctx.stream(method)(options)` for client/bidi). Omitted dimensions cascade from the incoming request.

```typescript
type CallOptions = {
  signal?: AbortSignal;   // default: inbound ctx.signal
  timeoutMs?: number;     // default: remaining inbound deadline
  headers?: HeadersInit;  // default: none (see below)
  endpoint?: string;      // hint for the remoteResolver
};
```

- **`signal`** — when omitted, the inbound request's `ctx.signal` is injected, so cancelling the inbound RPC cancels every in-flight `ctx.call`. A supplied signal **replaces** the cascade — it is **not** AND-linked with `ctx.signal`.
- **`timeoutMs`** — when omitted, the remaining inbound deadline (`ctx.timeoutMs()`) is injected. A caller may **shorten** the deadline but never extend it; the effective value is `min(timeoutMs, remaining)`. An over-long override is clamped to the remaining deadline.
- **Trace context** flows implicitly via the `@connectum/otel` client interceptor when it is mounted in `outgoingInterceptors` — no header plumbing needed.
- **Headers are NOT propagated by default.** No inbound header leaks onto an outgoing call.

### Header propagation

Opt in by listing header names in `createServer({ propagateHeaders })`. `defaultPropagateHeaders` is a ready-made allow-list of W3C trace-context headers (`["traceparent", "tracestate"]`) you can spread and extend. `authorization` is deliberately excluded — forwarding credentials is a security-sensitive choice you must make explicitly.

```typescript
import { createServer, defaultPropagateHeaders } from '@connectum/core';

const server = createServer({
  services: [orders],
  catalog,
  propagateHeaders: [...defaultPropagateHeaders, 'x-tenant-id'],
});
```

Explicit `CallOptions.headers` always win over a propagated value.

## Single-image, multiple roles — `enabledServices`

`enabledServices` is a list of full proto `typeName`s a process mounts **locally**. Any service in `services` whose `typeName` is not listed is treated as remote and reached via the `remoteResolver`. `undefined` mounts every provided service locally. This lets one image play different roles depending on configuration — a modular monolith in one deployment, split processes in another, with no code change.

```typescript
import { createServer, parseServicesEnv } from '@connectum/core';

const server = createServer({
  services: [orders, inventory, payments],
  catalog,
  // e.g. CONNECTUM_SERVICES="orders.v1.OrdersService,inventory.v1.InventoryService"
  enabledServices: parseServicesEnv(process.env.CONNECTUM_SERVICES),
  remoteResolver, // see the Resolvers guide
});
```

Full `typeName`s are mandatory — short names collide (`catalog.v1.UsersService` and `auth.v1.UsersService` both shorten to `users`). Three helpers support env-driven configuration:

- `parseServicesEnv(value)` — parses a comma-separated env string into a `string[]`, trimming whitespace and dropping empties. Returns `[]` for an empty/undefined value.
- `matchServicesPattern(pattern, names)` — returns the subset of `names` matching a glob `pattern`, where `*` matches any run of characters including dots (e.g. `"acme.*"` matches `"acme.v1.UsersService"`). This is a **glob, not a RegExp** — only `*` is special.
- `mergeEnabledServices(...lists)` — merges several lists, de-duplicating while preserving first-seen order.

## Calling from outside a handler

`ctx.call` only exists inside a handler (it needs a live `HandlerContext`). For boot code, scripts, or tests, use the server's client factories:

- **`server.localClient(Desc)`** — a fully-typed client that dispatches directly to handlers on this server, with no TCP socket. Safe to call before `server.start()`.
- **`server.client(Desc, options?)`** — auto-routes: in-process when the service is mounted locally, otherwise via the configured `remoteResolver`. The same call site works for monolith and split deployments. `options.endpoint` is an opaque hint forwarded to the resolver.

```typescript
const client = server.client(InventoryService);   // local or remote — same call
const stock = await client.checkStock({ sku: 'A-1' });
```

Both `server.localClient` and `server.client` require a `Server` instance. For a process with **no server at all** — a Temporal worker, a scheduler, a CLI — use `createCatalogClient`. It provides the same catalog-typed `call`/`stream` surface as the handler `ctx`, routing every call through the supplied resolver (there is no in-process path without a `Server`):

```typescript
import { createCatalogClient, mapResolver } from '@connectum/core';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { serviceCatalog } from './gen/catalog.js';

const client = createCatalogClient({
  catalog: serviceCatalog,
  resolver: mapResolver({
    'inventory.v1.InventoryService': createGrpcTransport({ baseUrl: process.env.INVENTORY_ADDR }),
  }),
});

const stock = await client.call('inventory.v1.InventoryService/CheckStock', { sku: 'A-1' });
// ctx.stream mirrors: client.stream('...')(request) for server-streaming, etc.
```

## Error model

Connectum splits **configuration mistakes** (programmer errors, thrown eagerly) from **operational failures** (runtime, mapped to RPC status codes).

**`CatalogConfigError`** — a configuration mistake; fails loud with a stack trace. Thrown for:

- `server.client(Desc)` on a service that is **not mounted locally and has no `remoteResolver`** configured (the catalog is not consulted in this path);
- `enabledServices` that is **not a subset of the catalog** at `start()` (caught by an always-on shape check);
- a **duplicate `typeName`** during `mergeCatalogs`.

**`ConnectError`** — operational failures from `ctx.call` / `ctx.stream`, with the appropriate Connect status code:

| Situation | Code |
|-----------|------|
| No catalog configured | `Code.FailedPrecondition` |
| Unknown service, or known service with unknown method | `Code.Unimplemented` |
| `remoteResolver` returns `null` (no route) | `Code.Unavailable` |
| `remoteResolver` throws | `Code.Internal` (original error preserved as `cause`) |

## Related

- [Resolvers](/en/guide/service-communication/resolvers) -- resolver patterns (`singleTransportResolver`, `mapResolver`, `dnsResolver`, `perServiceEnvResolver`) for remote routing
- [Communication Patterns](./patterns) -- request-response chains, fan-out/fan-in, streaming
- [Client Interceptors](./client-interceptors) -- OTel, resilience, the `outgoingInterceptors` chain

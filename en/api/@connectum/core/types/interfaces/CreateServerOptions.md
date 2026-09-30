[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / CreateServerOptions

# Interface: CreateServerOptions

Defined in: [packages/core/src/types.ts:262](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L262)

Server configuration options for createServer()

## Properties

### allowHTTP1?

> `optional` **allowHTTP1?**: `boolean`

Defined in: [packages/core/src/types.ts:346](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L346)

Allow HTTP/1.1 connections.

With TLS: enables ALPN negotiation (both HTTP/1.1 and HTTP/2).
Without TLS: creates HTTP/1.1 server (http.createServer).
Set to false without TLS for h2c-only (http2.createServer).

#### Default

```ts
true
```

***

### catalog?

> `optional` **catalog?**: `Readonly`\<`Record`\<`string`, `DescService`\>\>

Defined in: [packages/core/src/types.ts:415](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L415)

The full set of services known to the system, `typeName → DescService`
(typically the generated `serviceCatalog`). Drives startup validation and
remote routing. Optional — a process that hosts everything locally and
makes no cross-service calls needs no catalog.

***

### enabledServices?

> `optional` **enabledServices?**: readonly `string`[]

Defined in: [packages/core/src/types.ts:423](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L423)

Proto `typeName`s to mount **locally** from `services`. A service in
`services` whose `typeName` is not listed is treated as remote (resolved
via [CreateServerOptions.remoteResolver](#remoteresolver)). `undefined` mounts every
provided service locally.

***

### eventBus?

> `optional` **eventBus?**: [`EventBusLike`](EventBusLike.md)

Defined in: [packages/core/src/types.ts:335](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L335)

Event bus instance for pub/sub messaging.

The event bus is started during `server.start()` (after route building,
before transport listen) and stopped during graceful shutdown.

#### Example

```typescript
import { createEventBus } from '@connectum/events';
import { NatsAdapter } from '@connectum/events-nats';

const eventBus = createEventBus({
  adapter: NatsAdapter({ servers: ['nats://localhost:4222'] }),
  router: eventRouter,
});

const server = createServer({
  services: [routes],
  eventBus,
});
```

***

### handshakeTimeout?

> `optional` **handshakeTimeout?**: `number`

Defined in: [packages/core/src/types.ts:374](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L374)

Handshake timeout in milliseconds

#### Default

```ts
30000
```

***

### host?

> `optional` **host?**: `string`

Defined in: [packages/core/src/types.ts:278](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L278)

Server host to bind

#### Default

```ts
"0.0.0.0"
```

***

### http2Options?

> `optional` **http2Options?**: `SecureServerOptions`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`, *typeof* `Http2ServerRequest`, *typeof* `Http2ServerResponse`\>

Defined in: [packages/core/src/types.ts:379](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L379)

Additional HTTP/2 server options

***

### interceptors?

> `optional` **interceptors?**: `Interceptor`[]

Defined in: [packages/core/src/types.ts:311](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L311)

ConnectRPC interceptors.
When omitted or `[]`, no interceptors are applied.
Use `createDefaultInterceptors()` from `@connectum/interceptors` to get the default chain.

***

### jsonOptions?

> `optional` **jsonOptions?**: `Partial`\<`JsonReadOptions` & `JsonWriteOptions`\>

Defined in: [packages/core/src/types.ts:405](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L405)

Connect JSON serialization options applied server-wide.

Passed through to the underlying `connectNodeAdapter`, so it affects every
registered service and protocol (e.g. healthcheck, reflection). The most
common use is `alwaysEmitImplicit: true`, which includes fields with
implicit presence (proto3 scalar `0`, empty string/list, enum default) in
JSON responses instead of omitting them.

For per-service control, pass the same option as the third argument of
`router.service()` inside a [ServiceDefinition](../../interfaces/ServiceDefinition.md)'s `register` closure
instead.

Note: the relevant `JsonWriteOptions` field in `@bufbuild/protobuf` v2 is
`alwaysEmitImplicit` (named `emitDefaultValues` in v1).

#### Example

```typescript
const server = createServer({
  services: [routes],
  jsonOptions: { alwaysEmitImplicit: true },
});
```

***

### outgoingInterceptors?

> `optional` **outgoingInterceptors?**: readonly `Interceptor`[]

Defined in: [packages/core/src/types.ts:437](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L437)

Client-side interceptors applied to every outgoing `server.client()` /
`ctx.call` call (cross-cutting concerns like auth or logging), so call
sites stay free of boilerplate.

***

### port?

> `optional` **port?**: `number`

Defined in: [packages/core/src/types.ts:272](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L272)

Server port

#### Default

```ts
5000
```

***

### propagateHeaders?

> `optional` **propagateHeaders?**: readonly `string`[]

Defined in: [packages/core/src/types.ts:447](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L447)

Inbound header names to copy onto every outgoing `ctx.call` / `ctx.stream`.
Empty by default — no header is propagated implicitly. Explicit
`CallOptions.headers` always win over a propagated value.

Use [defaultPropagateHeaders](../../variables/defaultPropagateHeaders.md) (W3C trace-context headers) as a base
and add your own, e.g. `[...defaultPropagateHeaders, "x-tenant-id"]`.

***

### protocols?

> `optional` **protocols?**: [`ProtocolRegistration`](ProtocolRegistration.md)[]

Defined in: [packages/core/src/types.ts:299](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L299)

Protocol registrations (healthcheck, reflection, custom)

#### Example

```typescript
import { Healthcheck } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';

const server = createServer({
  services: [routes],
  protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
});
```

***

### remoteResolver?

> `optional` **remoteResolver?**: [`RemoteResolver`](../../type-aliases/RemoteResolver.md)

Defined in: [packages/core/src/types.ts:430](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L430)

Resolves a service that is not mounted locally to a `Transport`. Consulted
by `server.client()` (and `ctx.call`) for remote services. Synchronous and
must not perform network I/O — see [RemoteResolver](../../type-aliases/RemoteResolver.md).

***

### services

> **services**: readonly [`ServiceDefinition`](../../interfaces/ServiceDefinition.md)[]

Defined in: [packages/core/src/types.ts:266](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L266)

Service routes to register

***

### shutdown?

> `optional` **shutdown?**: [`ShutdownOptions`](ShutdownOptions.md)

Defined in: [packages/core/src/types.ts:304](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L304)

Graceful shutdown configuration

***

### tls?

> `optional` **tls?**: [`TLSOptions`](TLSOptions.md)

Defined in: [packages/core/src/types.ts:283](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L283)

TLS configuration

***

### transportValidation?

> `optional` **transportValidation?**: `"error"` \| `"warn"` \| `"off"`

Defined in: [packages/core/src/types.ts:368](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L368)

Startup validation of streaming method kinds vs the effective transport.

Bidi-streaming methods require HTTP/2 (Connect protocol: "Bidirectional
streaming requires HTTP/2, but the other RPC types also support
HTTP/1.1"). On a plaintext HTTP/1.1 server (no TLS + `allowHTTP1: true`,
the default) they fail silently at runtime — the first send hangs
forever. With `"error"` (default) `start()` rejects with a
`TransportValidationError` (code `CONNECTUM_UNSUPPORTED_STREAMING_TRANSPORT`)
naming the affected methods and both fixes; `"warn"` logs once and
starts anyway; `"off"` skips the check.

On a TLS server that also allows HTTP/1.1 (`allowHTTP1: true`), bidi
works for HTTP/2 clients but a client negotiating HTTP/1.1 over TLS
hits the same hang — this residual risk is always a one-time warning
(never a hard error), silenced only by `"off"`. Set `allowHTTP1: false`
to remove the risk (the server refuses HTTP/1.1 at ALPN).

#### Default

```ts
"error"
```

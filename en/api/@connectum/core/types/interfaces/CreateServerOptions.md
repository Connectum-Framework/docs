[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / CreateServerOptions

# Interface: CreateServerOptions

Defined in: [packages/core/src/types.ts:283](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L283)

Server configuration options for createServer()

## Properties

### allowHTTP1?

> `optional` **allowHTTP1?**: `boolean`

Defined in: [packages/core/src/types.ts:367](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L367)

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

> `optional` **catalog?**: `Readonly`\<`Record`\<`string`, [`DescService`](https://protobufes.com/reference/reflection/descriptors/#types)\>\>

Defined in: [packages/core/src/types.ts:528](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L528)

The full set of services known to the system, `typeName → DescService`
(typically the generated `serviceCatalog`). Drives startup validation and
remote routing. Optional — a process that hosts everything locally and
makes no cross-service calls needs no catalog.

***

### enabledServices?

> `optional` **enabledServices?**: readonly `string`[]

Defined in: [packages/core/src/types.ts:538](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L538)

Proto `typeName`s to mount **locally** from `services`. A service in
`services` whose `typeName` is not listed is treated as remote (resolved
via [CreateServerOptions.remoteResolver](#remoteresolver)). `undefined` mounts every
provided service locally, whether the property is omitted or set to
`undefined`, so `enabledServicesFromEnv(process.env.X)` can be passed as is.
An empty list mounts none of them.

***

### eventBus?

> `optional` **eventBus?**: [`EventBusLike`](EventBusLike.md)

Defined in: [packages/core/src/types.ts:356](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L356)

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

Defined in: [packages/core/src/types.ts:395](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L395)

Handshake timeout in milliseconds

#### Default

```ts
30000
```

***

### host?

> `optional` **host?**: `string`

Defined in: [packages/core/src/types.ts:299](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L299)

Server host to bind

#### Default

```ts
"0.0.0.0"
```

***

### http2Options?

> `optional` **http2Options?**: `SecureServerOptions`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`, *typeof* `Http2ServerRequest`, *typeof* `Http2ServerResponse`\>

Defined in: [packages/core/src/types.ts:400](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L400)

Additional HTTP/2 server options

***

### interceptors?

> `optional` **interceptors?**: `Interceptor`[]

Defined in: [packages/core/src/types.ts:332](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L332)

ConnectRPC interceptors.
When omitted or `[]`, no interceptors are applied.
Use `createDefaultInterceptors()` from `@connectum/interceptors` to get the default chain.

***

### jsonOptions?

> `optional` **jsonOptions?**: `Partial`\<`JsonReadOptions` & `JsonWriteOptions`\>

Defined in: [packages/core/src/types.ts:426](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L426)

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

Defined in: [packages/core/src/types.ts:569](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L569)

Client-side interceptors for every catalog-routed call this server makes:
`ctx.call` / `ctx.stream` and `server.client()`, whichever route the target
takes — in-process when the service is mounted on this server, the
`remoteResolver`'s transport otherwise (including `mockResolver` routes in
tests). The chain runs exactly once per call, in source order (first element
outermost), outside the interceptors of the resolver's transport, with the
call's deadline budget already running. `server.localClient()` and
`createLocalTransport()` stay plain.

Put application policy here (identity, tracing, resilience) and keep only
transport-specific middleware on the resolver's transports: the framework
cannot see inside a `Transport`, so a policy configured in both places runs
twice. On a resolver route an interceptor observes the synthetic
`req.url` `https://catalog/<typeName>/<Method>`, `requestMethod: "POST"`
and no protocol headers (a `Transport` does not expose its address, and it
adds `content-type`, `connect-timeout-ms` and friends inside); wire-level
policy — request signing over headers, an audience derived from the host —
belongs on the resolver's transport, whose own interceptors see the wire
request. `timeoutMs <= 0` means no deadline here, as on any Connect
transport.

***

### port?

> `optional` **port?**: `number`

Defined in: [packages/core/src/types.ts:293](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L293)

Server port

#### Default

```ts
5000
```

***

### propagateHeaders?

> `optional` **propagateHeaders?**: readonly `string`[]

Defined in: [packages/core/src/types.ts:579](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L579)

Inbound header names to copy onto every outgoing `ctx.call` / `ctx.stream`.
Empty by default — no header is propagated implicitly. Explicit
`CallOptions.headers` always win over a propagated value.

Use [defaultPropagateHeaders](../../variables/defaultPropagateHeaders.md) (W3C trace-context headers) as a base
and add your own, e.g. `[...defaultPropagateHeaders, "x-tenant-id"]`.

***

### protocols?

> `optional` **protocols?**: [`ProtocolRegistration`](ProtocolRegistration.md)[]

Defined in: [packages/core/src/types.ts:320](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L320)

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

### readMaxBytes?

> `optional` **readMaxBytes?**: `number`

Defined in: [packages/core/src/types.ts:518](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L518)

Server-wide per-message read limit in bytes: Connect's `readMaxBytes`.
Opt-in; when unset, Connect's default (about 4 GiB) applies.

A request message larger than the limit ends the call with
`Code.ResourceExhausted` before the handler runs; a message exactly at
the limit is accepted. Applies identically on the HTTP and in-process
transports (the in-process transport serializes messages in binary
form). Only the diagnostic text of the error may differ between them:
over HTTP it can include the observed size.

This is a **default, not a ceiling**: a service that sets `readMaxBytes`
in its `ServiceOptions` uses its own value, larger or smaller.

Must be an integer from 1 to 4294967295 (Connect's maximum).
`createServer()` throws a `RangeError` naming the option for anything
else — `0`, negatives, fractions, `NaN`, `Infinity` — and a `TypeError`
for a non-number. (Left to Connect, `NaN` would silently disable the
limit.)

#### Example

```typescript
const server = createServer({
  services: [routes],
  readMaxBytes: 1024 * 1024, // 1 MiB per request message
});
```

***

### remoteResolver?

> `optional` **remoteResolver?**: [`RemoteResolver`](../../type-aliases/RemoteResolver.md)

Defined in: [packages/core/src/types.ts:545](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L545)

Resolves a service that is not mounted locally to a `Transport`. Consulted
by `server.client()` (and `ctx.call`) for remote services. Synchronous and
must not perform network I/O — see [RemoteResolver](../../type-aliases/RemoteResolver.md).

***

### requestGate?

> `optional` **requestGate?**: (`context`) => `void` \| `Promise`\<`void`\>

Defined in: [packages/core/src/types.ts:488](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L488)

Server-wide request gate: Connect's `requestGate`, applied to every RPC
on this server. Opt-in; unset by default.

The gate receives the call's `HandlerContext` after the request headers
are available and **before any request message is received,
decompressed, or parsed**. Return to admit the call; throw a
`ConnectError` to end it without reading the body. It is the cheap place
to reject, for example, a request without credentials.

Contract:
- **Both transports, no exemption.** The gate runs identically for HTTP
  calls and for in-process calls (`server.localClient()`,
  `server.client()` of a local service, `createLocalTransport()`, and
  `ctx.call` / `ctx.stream` to a local service). An internal `ctx.call`
  carries only the headers you forward (`propagateHeaders`,
  `outgoingInterceptors`), so a header-based gate rejects it unless the
  credential is forwarded.
- **Client-safe errors only.** A gate runs before the server
  interceptor chain, so an `errorHandler` interceptor never sees its
  error. A thrown `ConnectError` reaches the client exactly as thrown
  (code, message, metadata, details) — throw a fixed, non-revealing
  message. Anything else (a plain `Error`, a string, a rejected promise)
  is replaced by Connect with `ConnectError("internal error",
  Code.Internal)`; its text never reaches the client.
- Must be a function; anything else throws a `TypeError` from
  `createServer()`.
- **Invisible to server interceptors.** A rejected call never runs
  server-side interceptors: no server span, metric, or log entry from
  `@connectum/otel` or the logger. To audit rejections, wrap your gate
  (catch, record, rethrow). Client-side interceptors of the caller still
  observe the failure.
- **Coverage.** Every RPC on the router, including protocol RPCs such as
  gRPC Health and Reflection. Plain HTTP endpoints served by protocol
  HTTP handlers (for example the HTTP health endpoints) are not gated.
- **Server default, service override.** A service that sets
  `requestGate` in its `ServiceOptions` (the third argument of
  `defineService` / `defineLazyService`) replaces this gate for that
  service; the two are not composed. An own `requestGate: undefined`
  key in the service options also removes it.
- **Cooperative cancellation.** The server awaits the gate. Watch
  `context.signal`: it aborts on the call's deadline, on client
  cancellation, and when `server.stop()` begins — on both transports.
- The parameter is Connect's `HandlerContext`, not the Connectum
  `Context`: `ctx.call` / `ctx.stream` do not exist yet at gate time.

#### Parameters

##### context

`HandlerContext`

#### Returns

`void` \| `Promise`\<`void`\>

#### Example

```typescript
import { Code, ConnectError } from '@connectrpc/connect';

const server = createServer({
  services: [routes],
  requestGate: (context) => {
    if (!context.requestHeader.get('authorization')) {
      throw new ConnectError('unauthenticated', Code.Unauthenticated);
    }
  },
});
```

***

### services

> **services**: readonly [`ServiceDefinition`](../../interfaces/ServiceDefinition.md)[]

Defined in: [packages/core/src/types.ts:287](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L287)

Service routes to register

***

### shutdown?

> `optional` **shutdown?**: [`ShutdownOptions`](ShutdownOptions.md)

Defined in: [packages/core/src/types.ts:325](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L325)

Graceful shutdown configuration

***

### tls?

> `optional` **tls?**: [`TLSOptions`](TLSOptions.md)

Defined in: [packages/core/src/types.ts:304](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L304)

TLS configuration

***

### transportValidation?

> `optional` **transportValidation?**: `"error"` \| `"warn"` \| `"off"`

Defined in: [packages/core/src/types.ts:389](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L389)

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

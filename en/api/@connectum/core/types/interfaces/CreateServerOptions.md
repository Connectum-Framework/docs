[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / CreateServerOptions

# Interface: CreateServerOptions

Defined in: [packages/core/src/types.ts:214](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/types.ts#L214)

Server configuration options for createServer()

## Properties

### allowHTTP1?

> `optional` **allowHTTP1?**: `boolean`

Defined in: [packages/core/src/types.ts:298](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/types.ts#L298)

Allow HTTP/1.1 connections.

With TLS: enables ALPN negotiation (both HTTP/1.1 and HTTP/2).
Without TLS: creates HTTP/1.1 server (http.createServer).
Set to false without TLS for h2c-only (http2.createServer).

#### Default

```ts
true
```

***

### eventBus?

> `optional` **eventBus?**: [`EventBusLike`](EventBusLike.md)

Defined in: [packages/core/src/types.ts:287](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/types.ts#L287)

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

Defined in: [packages/core/src/types.ts:326](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/types.ts#L326)

Handshake timeout in milliseconds

#### Default

```ts
30000
```

***

### host?

> `optional` **host?**: `string`

Defined in: [packages/core/src/types.ts:230](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/types.ts#L230)

Server host to bind

#### Default

```ts
"0.0.0.0"
```

***

### http2Options?

> `optional` **http2Options?**: `SecureServerOptions`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`, *typeof* `Http2ServerRequest`, *typeof* `Http2ServerResponse`\>

Defined in: [packages/core/src/types.ts:331](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/types.ts#L331)

Additional HTTP/2 server options

***

### interceptors?

> `optional` **interceptors?**: `Interceptor`[]

Defined in: [packages/core/src/types.ts:263](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/types.ts#L263)

ConnectRPC interceptors.
When omitted or `[]`, no interceptors are applied.
Use `createDefaultInterceptors()` from `@connectum/interceptors` to get the default chain.

***

### jsonOptions?

> `optional` **jsonOptions?**: `Partial`\<`JsonReadOptions` & `JsonWriteOptions`\>

Defined in: [packages/core/src/types.ts:356](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/types.ts#L356)

Connect JSON serialization options applied server-wide.

Passed through to the underlying `connectNodeAdapter`, so it affects every
registered service and protocol (e.g. healthcheck, reflection). The most
common use is `alwaysEmitImplicit: true`, which includes fields with
implicit presence (proto3 scalar `0`, empty string/list, enum default) in
JSON responses instead of omitting them.

For per-service control, pass the same option as the third argument of
`router.service()` inside a [ServiceRoute](../type-aliases/ServiceRoute.md) instead.

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

### port?

> `optional` **port?**: `number`

Defined in: [packages/core/src/types.ts:224](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/types.ts#L224)

Server port

#### Default

```ts
5000
```

***

### protocols?

> `optional` **protocols?**: [`ProtocolRegistration`](ProtocolRegistration.md)[]

Defined in: [packages/core/src/types.ts:251](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/types.ts#L251)

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

### services

> **services**: [`ServiceRoute`](../type-aliases/ServiceRoute.md)[]

Defined in: [packages/core/src/types.ts:218](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/types.ts#L218)

Service routes to register

***

### shutdown?

> `optional` **shutdown?**: [`ShutdownOptions`](ShutdownOptions.md)

Defined in: [packages/core/src/types.ts:256](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/types.ts#L256)

Graceful shutdown configuration

***

### tls?

> `optional` **tls?**: [`TLSOptions`](TLSOptions.md)

Defined in: [packages/core/src/types.ts:235](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/types.ts#L235)

TLS configuration

***

### transportValidation?

> `optional` **transportValidation?**: `"error"` \| `"warn"` \| `"off"`

Defined in: [packages/core/src/types.ts:320](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/types.ts#L320)

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

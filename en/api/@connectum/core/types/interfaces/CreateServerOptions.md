[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / CreateServerOptions

# Interface: CreateServerOptions

Defined in: [packages/core/src/types.ts:214](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L214)

Server configuration options for createServer()

## Properties

### allowHTTP1?

> `optional` **allowHTTP1?**: `boolean`

Defined in: [packages/core/src/types.ts:298](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L298)

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

Defined in: [packages/core/src/types.ts:287](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L287)

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

Defined in: [packages/core/src/types.ts:304](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L304)

Handshake timeout in milliseconds

#### Default

```ts
30000
```

***

### host?

> `optional` **host?**: `string`

Defined in: [packages/core/src/types.ts:230](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L230)

Server host to bind

#### Default

```ts
"0.0.0.0"
```

***

### http2Options?

> `optional` **http2Options?**: `SecureServerOptions`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`, *typeof* `Http2ServerRequest`, *typeof* `Http2ServerResponse`\>

Defined in: [packages/core/src/types.ts:309](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L309)

Additional HTTP/2 server options

***

### interceptors?

> `optional` **interceptors?**: `Interceptor`[]

Defined in: [packages/core/src/types.ts:263](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L263)

ConnectRPC interceptors.
When omitted or `[]`, no interceptors are applied.
Use `createDefaultInterceptors()` from `@connectum/interceptors` to get the default chain.

***

### port?

> `optional` **port?**: `number`

Defined in: [packages/core/src/types.ts:224](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L224)

Server port

#### Default

```ts
5000
```

***

### protocols?

> `optional` **protocols?**: [`ProtocolRegistration`](ProtocolRegistration.md)[]

Defined in: [packages/core/src/types.ts:251](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L251)

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

Defined in: [packages/core/src/types.ts:218](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L218)

Service routes to register

***

### shutdown?

> `optional` **shutdown?**: [`ShutdownOptions`](ShutdownOptions.md)

Defined in: [packages/core/src/types.ts:256](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L256)

Graceful shutdown configuration

***

### tls?

> `optional` **tls?**: [`TLSOptions`](TLSOptions.md)

Defined in: [packages/core/src/types.ts:235](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/core/src/types.ts#L235)

TLS configuration

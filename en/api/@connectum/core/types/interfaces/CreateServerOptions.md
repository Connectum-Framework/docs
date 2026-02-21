[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / CreateServerOptions

# Interface: CreateServerOptions

Defined in: [packages/core/src/types.ts:192](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/core/src/types.ts#L192)

Server configuration options for createServer()

## Properties

### allowHTTP1?

> `optional` **allowHTTP1**: `boolean`

Defined in: [packages/core/src/types.ts:252](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/core/src/types.ts#L252)

Allow HTTP/1.1 connections.

With TLS: enables ALPN negotiation (both HTTP/1.1 and HTTP/2).
Without TLS: creates HTTP/1.1 server (http.createServer).
Set to false without TLS for h2c-only (http2.createServer).

#### Default

```ts
true
```

***

### handshakeTimeout?

> `optional` **handshakeTimeout**: `number`

Defined in: [packages/core/src/types.ts:258](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/core/src/types.ts#L258)

Handshake timeout in milliseconds

#### Default

```ts
30000
```

***

### host?

> `optional` **host**: `string`

Defined in: [packages/core/src/types.ts:208](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/core/src/types.ts#L208)

Server host to bind

#### Default

```ts
"0.0.0.0"
```

***

### http2Options?

> `optional` **http2Options**: `SecureServerOptions`\<*typeof* `IncomingMessage`, *typeof* `ServerResponse`, *typeof* `Http2ServerRequest`, *typeof* `Http2ServerResponse`\>

Defined in: [packages/core/src/types.ts:263](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/core/src/types.ts#L263)

Additional HTTP/2 server options

***

### interceptors?

> `optional` **interceptors**: `Interceptor`[]

Defined in: [packages/core/src/types.ts:241](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/core/src/types.ts#L241)

ConnectRPC interceptors.
When omitted or `[]`, no interceptors are applied.
Use `createDefaultInterceptors()` from `@connectum/interceptors` to get the default chain.

***

### port?

> `optional` **port**: `number`

Defined in: [packages/core/src/types.ts:202](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/core/src/types.ts#L202)

Server port

#### Default

```ts
5000
```

***

### protocols?

> `optional` **protocols**: [`ProtocolRegistration`](ProtocolRegistration.md)[]

Defined in: [packages/core/src/types.ts:229](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/core/src/types.ts#L229)

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

Defined in: [packages/core/src/types.ts:196](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/core/src/types.ts#L196)

Service routes to register

***

### shutdown?

> `optional` **shutdown**: [`ShutdownOptions`](ShutdownOptions.md)

Defined in: [packages/core/src/types.ts:234](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/core/src/types.ts#L234)

Graceful shutdown configuration

***

### tls?

> `optional` **tls**: [`TLSOptions`](TLSOptions.md)

Defined in: [packages/core/src/types.ts:213](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/core/src/types.ts#L213)

TLS configuration

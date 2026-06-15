[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / CallOptions

# Type Alias: CallOptions

> **CallOptions** = `object`

Defined in: [packages/core/src/context.ts:40](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/context.ts#L40)

Per-call overrides for [Context.call](../interfaces/Context.md#call).

Every field is optional; omitted dimensions cascade from the incoming
request (see the auto-injection rules on [Context.call](../interfaces/Context.md#call)). This is the
Connectum catalog `CallOptions`, intentionally distinct from
`@connectrpc/connect`'s client `CallOptions`.

## Properties

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/core/src/context.ts:65](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/context.ts#L65)

Opaque endpoint hint forwarded to the configured `remoteResolver` for
services reachable at several endpoints. Ignored for locally-mounted
services.

***

### headers?

> `optional` **headers?**: `HeadersInit`

Defined in: [packages/core/src/context.ts:59](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/context.ts#L59)

Extra request headers. Only these explicit headers are sent; no inbound
headers are auto-propagated (trace context flows implicitly via the OTel
client interceptor in `outgoingInterceptors`).

***

### signal?

> `optional` **signal?**: `AbortSignal`

Defined in: [packages/core/src/context.ts:47](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/context.ts#L47)

Abort signal for the outgoing call. When omitted, the incoming request's
`ctx.signal` is injected, so cancelling the inbound RPC cancels every
in-flight `ctx.call`. A supplied signal **replaces** the cascade (it is
not linked with `ctx.signal`).

***

### timeoutMs?

> `optional` **timeoutMs?**: `number`

Defined in: [packages/core/src/context.ts:53](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/context.ts#L53)

Timeout in milliseconds. When omitted, the remaining inbound deadline
(`ctx.timeoutMs()`) is injected. A caller may **shorten** the deadline,
never extend it (the effective value is `min(timeoutMs, remaining)`).

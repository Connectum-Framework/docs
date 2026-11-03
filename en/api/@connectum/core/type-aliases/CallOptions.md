[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / CallOptions

# Type Alias: CallOptions

> **CallOptions** = `object`

Defined in: [packages/core/src/context.ts:40](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L40)

Per-call overrides for [Context.call](../interfaces/Context.md#call).

Every field is optional; omitted dimensions cascade from the incoming
request (see the auto-injection rules on [Context.call](../interfaces/Context.md#call)). This is the
Connectum catalog `CallOptions`, intentionally distinct from
`@connectrpc/connect`'s client `CallOptions`.

## Properties

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/core/src/context.ts:77](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L77)

Opaque endpoint hint forwarded to the configured `remoteResolver` for
services reachable at several endpoints. Ignored for locally-mounted
services. An empty string counts as no endpoint: the resolver receives
the same context, and shares the same cached transport, as for a call
without the option.

***

### headers?

> `optional` **headers?**: `HeadersInit`

Defined in: [packages/core/src/context.ts:69](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L69)

Extra request headers. By default no inbound header is forwarded: only
the inbound headers named in `createServer({ propagateHeaders })` (empty
by default) are copied onto an outgoing `ctx.call` / `ctx.stream`. The
headers given here are sent on top of them and win on a name conflict.
A standalone `createCatalogClient` has no inbound request and sends
these headers verbatim. Trace context is not carried by this option: the
`@connectum/otel` client interceptor injects it when it is mounted in
`outgoingInterceptors`.

***

### signal?

> `optional` **signal?**: `AbortSignal`

Defined in: [packages/core/src/context.ts:47](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L47)

Abort signal for the outgoing call. When omitted, the incoming request's
`ctx.signal` is injected, so cancelling the inbound RPC cancels every
in-flight `ctx.call`. A supplied signal **replaces** the cascade (it is
not linked with `ctx.signal`).

***

### timeoutMs?

> `optional` **timeoutMs?**: `number`

Defined in: [packages/core/src/context.ts:58](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L58)

Timeout in milliseconds. When omitted, the remaining inbound deadline
(`ctx.timeoutMs()`) is injected. A caller may **shorten** the deadline,
never extend it (the effective value is `min(timeoutMs, remaining)`).
Must be a finite number greater than 0: any other value rejects the call
with `Code.InvalidArgument` instead of lifting the inherited deadline. If
the inbound deadline has already passed, the call fails with
`Code.DeadlineExceeded`. A standalone `createCatalogClient` has no
inbound deadline and passes a valid value on as is.

[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / createLocalTransport

# Function: createLocalTransport()

> **createLocalTransport**(`server`, `options?`): `Transport`

Defined in: [packages/core/src/localTransport.ts:118](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/localTransport.ts#L118)

Create an in-process ConnectRPC `Transport` over the services already
registered on the given Connectum `Server`.

The transport is safe to use before `server.start()` — it never opens a
TCP/UDP port or HTTP/2 session. Server-side interceptors configured via
`createServer({ interceptors })` are applied inside the handler chain;
`options.interceptors` are applied on the client side of the call.

Headers are propagated via `Headers` objects through the in-memory pipe;
the wrapped `createRouterTransport` already clones headers at the call
boundary, providing mutation isolation between client and server.

Cancellation: a streaming call is cancelled by the `AbortSignal` passed in
the call options, by its deadline, or by `server.stop()`. The handler's
`ctx.signal` aborts and its output generator is finished, so a handler
parked at `yield` runs its `finally`. Leaving a `for await` loop with
`break` is not a cancellation: the handler keeps running until one of the
above happens.

The synthetic origin observed by interceptors reading `req.url` is
`https://in-memory/<service>/<method>` (set by the underlying ConnectRPC
router transport — see `@connectrpc/connect`'s `router-transport.ts`).

## Parameters

### server

[`Server`](../types/interfaces/Server.md)

A server created via `createServer({...})`.

### options?

[`CreateLocalTransportOptions`](../interfaces/CreateLocalTransportOptions.md)

Optional client-side interceptors.

## Returns

`Transport`

A ConnectRPC `Transport` suitable for `createClient(service, transport)`.

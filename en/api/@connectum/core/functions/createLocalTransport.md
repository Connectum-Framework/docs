[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / createLocalTransport

# Function: createLocalTransport()

> **createLocalTransport**(`server`, `options?`): `Transport`

Defined in: [packages/core/src/localTransport.ts:190](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/localTransport.ts#L190)

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
the call options, by its deadline, by `server.stop()`, or by the caller
leaving its `for await` loop early with `break` (the response iterator's
`return()`, which ends the call as it does over HTTP; requires
`@connectrpc/connect` 2.3.0 or later). The handler's `ctx.signal` aborts and
its output generator is finished, so a handler parked at `yield` runs its
`finally`. After a `break` the client-side interceptors see their response
stream end without an error; only the handler sees the call cancelled.
A server-streaming or bidirectional call made once `server.stop()` has begun
cannot be served: its first read fails with `unavailable` and the handler body
does not start. A client-streaming or bidirectional handler waiting for the
next request message is released when the caller cancels the call: its loop
over the requests ends, as it does when HTTP/2 closes the request body.
`server.stop()` does not do that: it does not end an in-process call, so an
upload that is still being sent keeps being read.

Request streams: the caller's request stream of a client-streaming or
bidirectional call is advanced in the caller's async context, below the
client-side interceptors, as it is over HTTP, not in the handler's. The
caller's generator therefore observes the caller's own `AsyncLocalStorage`
values (identity, trace, application values) and never the ones a
server-side interceptor scoped around the handler. On cancellation its
`return`/`throw` run in the context that raised the abort, on both
transports.

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

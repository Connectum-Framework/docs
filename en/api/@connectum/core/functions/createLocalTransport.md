[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / createLocalTransport

# Function: createLocalTransport()

> **createLocalTransport**(`server`, `options?`): `Transport`

Defined in: [packages/core/src/localTransport.ts:104](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/localTransport.ts#L104)

Create an in-process ConnectRPC `Transport` over the services already
registered on the given Connectum `Server`.

The transport is safe to use before `server.start()` — it never opens a
TCP/UDP port or HTTP/2 session. Server-side interceptors configured via
`createServer({ interceptors })` are applied inside the handler chain;
`options.interceptors` are applied on the client side of the call.

Headers are propagated via `Headers` objects through the in-memory pipe;
the wrapped `createRouterTransport` already clones headers at the call
boundary, providing mutation isolation between client and server.

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

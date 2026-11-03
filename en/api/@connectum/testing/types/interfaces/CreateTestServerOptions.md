[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [types](../index.md) / CreateTestServerOptions

# Interface: CreateTestServerOptions

Defined in: [testing/src/types.ts:48](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/types.ts#L48)

Options for [createTestServer](../../index/functions/createTestServer.md).

The element types are those of `createServer()`; a value of another type is
a compile error, and in untyped code `createTestServer()` rejects it with a
`TypeError` that names the option and the index of the element.

## Properties

### host?

> `optional` **host?**: `string`

Defined in: [testing/src/types.ts:71](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/types.ts#L71)

Address to listen on, a non-empty string. Default: `127.0.0.1`, so the
server is reachable from this machine only: the server has no
authentication, and the transport this helper returns runs in the same
process. Pass `0.0.0.0` (or `::`) to listen on all interfaces, for a test
that reaches the server from another container or host.

`baseUrl` points at the address that was bound; a wildcard or the default
loopback address is reached as `localhost`. An IPv6 literal other than the
`::` wildcard (such as `::1`) is not usable on Node.js: the HTTP/2 client
sends the authority without brackets and the server fails to parse it
(observed on Node.js 26.12.1; Bun serves it). Use `127.0.0.1`, a host name
or `::`.

***

### interceptors?

> `optional` **interceptors?**: readonly `Interceptor`[]

Defined in: [testing/src/types.ts:52](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/types.ts#L52)

Interceptors to apply. Default: `[]`

***

### port?

> `optional` **port?**: `number`

Defined in: [testing/src/types.ts:56](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/types.ts#L56)

Port number. Default: `0` (random available port)

***

### protocols?

> `optional` **protocols?**: readonly `ProtocolRegistration`[]

Defined in: [testing/src/types.ts:54](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/types.ts#L54)

Protocol extensions (Healthcheck, Reflection). Default: `[]`

***

### services

> **services**: readonly `ServiceDefinition`[]

Defined in: [testing/src/types.ts:50](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/types.ts#L50)

Services to serve, as `defineService()` and `defineLazyService()` return them.

***

### shutdown?

> `optional` **shutdown?**: `object`

Defined in: [testing/src/types.ts:80](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/types.ts#L80)

Graceful shutdown of `close()`. Only `timeout` is offered: the longest wait,
in milliseconds (an integer from 0), for calls still in flight. A unary
handler that does not observe `ctx.signal` keeps `close()` waiting until
the timeout, 30 s by default, so a test with a handler that can hang sets
a short one. When it expires the remaining connections are closed and the
unfinished calls fail on the client.

#### timeout?

> `optional` **timeout?**: `number`

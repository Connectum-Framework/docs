[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / Context

# Interface: Context

Defined in: [packages/core/src/context.ts:131](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L131)

The context object passed to every Connectum service handler.

Extends ConnectRPC's `HandlerContext` (all of its fields remain available)
and adds [Context.call](#call) (unary catalog calls) and [Context.stream](#stream)
(streaming catalog calls).

## Extends

- `HandlerContext`

## Properties

### call

> **call**: [`CatalogCall`](../type-aliases/CatalogCall.md)

Defined in: [packages/core/src/context.ts:142](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L142)

Invoke a unary service in the catalog. The transport is chosen
automatically: an in-process call when the target is mounted locally,
otherwise the `remoteResolver`-supplied transport.

`signal` and `timeoutMs` cascade from the incoming request unless
overridden in `options` (see [CallOptions](../type-aliases/CallOptions.md)).

#### Type Param

**K**

A `"${typeName}/${Method}"` key of [ConnectumCallMap](ConnectumCallMap.md).

***

### method

> `readonly` **method**: `DescMethod`

Defined in: node\_modules/.pnpm/@connectrpc+connect@2.1.2\_@bufbuild+protobuf@2.12.0/node\_modules/@connectrpc/connect/dist/esm/implementation.d.ts:21

Metadata for the method being called.

#### Inherited from

`HandlerContext.method`

***

### protocolName

> `readonly` **protocolName**: `string`

Defined in: node\_modules/.pnpm/@connectrpc+connect@2.1.2\_@bufbuild+protobuf@2.12.0/node\_modules/@connectrpc/connect/dist/esm/implementation.d.ts:62

Name of the RPC protocol in use; one of "connect", "grpc" or "grpc-web".

#### Inherited from

`HandlerContext.protocolName`

***

### requestHeader

> `readonly` **requestHeader**: `Headers`

Defined in: node\_modules/.pnpm/@connectrpc+connect@2.1.2\_@bufbuild+protobuf@2.12.0/node\_modules/@connectrpc/connect/dist/esm/implementation.d.ts:47

Incoming request headers.

#### Inherited from

`HandlerContext.requestHeader`

***

### requestMethod

> `readonly` **requestMethod**: `string`

Defined in: node\_modules/.pnpm/@connectrpc+connect@2.1.2\_@bufbuild+protobuf@2.12.0/node\_modules/@connectrpc/connect/dist/esm/implementation.d.ts:43

HTTP method of incoming request, usually "POST", but "GET" in the case of
Connect Get.

#### Inherited from

`HandlerContext.requestMethod`

***

### responseHeader

> `readonly` **responseHeader**: `Headers`

Defined in: node\_modules/.pnpm/@connectrpc+connect@2.1.2\_@bufbuild+protobuf@2.12.0/node\_modules/@connectrpc/connect/dist/esm/implementation.d.ts:54

Outgoing response headers.

For methods that return a stream, response headers must be set before
yielding the first response message.

#### Inherited from

`HandlerContext.responseHeader`

***

### responseTrailer

> `readonly` **responseTrailer**: `Headers`

Defined in: node\_modules/.pnpm/@connectrpc+connect@2.1.2\_@bufbuild+protobuf@2.12.0/node\_modules/@connectrpc/connect/dist/esm/implementation.d.ts:58

Outgoing response trailers.

#### Inherited from

`HandlerContext.responseTrailer`

***

### service

> `readonly` **service**: `DescService`

Defined in: node\_modules/.pnpm/@connectrpc+connect@2.1.2\_@bufbuild+protobuf@2.12.0/node\_modules/@connectrpc/connect/dist/esm/implementation.d.ts:25

Metadata for the service being called.

#### Inherited from

`HandlerContext.service`

***

### signal

> `readonly` **signal**: `AbortSignal`

Defined in: node\_modules/.pnpm/@connectrpc+connect@2.1.2\_@bufbuild+protobuf@2.12.0/node\_modules/@connectrpc/connect/dist/esm/implementation.d.ts:33

An AbortSignal that triggers when the deadline is reached, or when an error
occurs that aborts processing of the request, but also when the RPC is
completed without error.

The signal can be used to automatically cancel downstream calls.

#### Inherited from

`HandlerContext.signal`

***

### stream

> **stream**: [`CatalogStream`](../type-aliases/CatalogStream.md)

Defined in: [packages/core/src/context.ts:155](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L155)

Open a streaming call to a service in the catalog. Returns a kind-specific
factory: server-streaming yields an `AsyncIterable`; client- and
bidi-streaming return push handles (see [ClientStreamHandle](ClientStreamHandle.md) /
[BidiStreamHandle](BidiStreamHandle.md)).

On a mid-stream transport failure the iterator delivers the messages
received so far and then throws the terminal `ConnectError`.

#### Type Param

**K**

A `"${typeName}/${Method}"` key of [ConnectumStreamMap](ConnectumStreamMap.md).

***

### timeoutMs

> `readonly` **timeoutMs**: () => `number` \| `undefined`

Defined in: node\_modules/.pnpm/@connectrpc+connect@2.1.2\_@bufbuild+protobuf@2.12.0/node\_modules/@connectrpc/connect/dist/esm/implementation.d.ts:38

If the current request has a timeout, this function returns the remaining
time.

#### Returns

`number` \| `undefined`

#### Inherited from

`HandlerContext.timeoutMs`

***

### url

> `readonly` **url**: `string`

Defined in: node\_modules/.pnpm/@connectrpc+connect@2.1.2\_@bufbuild+protobuf@2.12.0/node\_modules/@connectrpc/connect/dist/esm/implementation.d.ts:70

The URL received by the server.

#### Inherited from

`HandlerContext.url`

***

### values

> `readonly` **values**: `ContextValues`

Defined in: node\_modules/.pnpm/@connectrpc+connect@2.1.2\_@bufbuild+protobuf@2.12.0/node\_modules/@connectrpc/connect/dist/esm/implementation.d.ts:66

Per RPC context values that can be used to pass data to handlers.

#### Inherited from

`HandlerContext.values`

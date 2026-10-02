[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / CreateLocalTransportOptions

# Interface: CreateLocalTransportOptions

Defined in: [packages/core/src/localTransport.ts:49](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/localTransport.ts#L49)

Options for [createLocalTransport](../functions/createLocalTransport.md).

## Properties

### interceptors?

> `optional` **interceptors?**: `Interceptor`[]

Defined in: [packages/core/src/localTransport.ts:56](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/localTransport.ts#L56)

Client-side interceptors applied to outbound calls before they reach
the registered handlers. Server-side interceptors configured on the
`Server` instance still run inside the handler chain — these are
additive and run on the client side of the in-memory pipe.

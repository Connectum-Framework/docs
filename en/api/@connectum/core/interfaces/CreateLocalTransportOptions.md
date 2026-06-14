[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / CreateLocalTransportOptions

# Interface: CreateLocalTransportOptions

Defined in: [packages/core/src/localTransport.ts:44](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/localTransport.ts#L44)

Options for [createLocalTransport](../functions/createLocalTransport.md).

## Properties

### interceptors?

> `optional` **interceptors?**: `Interceptor`[]

Defined in: [packages/core/src/localTransport.ts:51](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/localTransport.ts#L51)

Client-side interceptors applied to outbound calls before they reach
the registered handlers. Server-side interceptors configured on the
`Server` instance still run inside the handler chain — these are
additive and run on the client side of the in-memory pipe.

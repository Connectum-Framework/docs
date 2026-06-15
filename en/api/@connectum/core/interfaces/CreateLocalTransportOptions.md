[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / CreateLocalTransportOptions

# Interface: CreateLocalTransportOptions

Defined in: [packages/core/src/localTransport.ts:44](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/localTransport.ts#L44)

Options for [createLocalTransport](../functions/createLocalTransport.md).

## Properties

### interceptors?

> `optional` **interceptors?**: `Interceptor`[]

Defined in: [packages/core/src/localTransport.ts:51](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/localTransport.ts#L51)

Client-side interceptors applied to outbound calls before they reach
the registered handlers. Server-side interceptors configured on the
`Server` instance still run inside the handler chain — these are
additive and run on the client side of the in-memory pipe.

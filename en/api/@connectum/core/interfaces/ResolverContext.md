[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ResolverContext

# Interface: ResolverContext

Defined in: [packages/core/src/remoteResolver.ts:46](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/remoteResolver.ts#L46)

Context handed to a [RemoteResolver](../type-aliases/RemoteResolver.md) for a single resolution.

## Properties

### endpoint?

> `readonly` `optional` **endpoint?**: `string`

Defined in: [packages/core/src/remoteResolver.ts:50](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/remoteResolver.ts#L50)

Opaque endpoint hint from `CallOptions.endpoint` (polymorphic deployments).

***

### typeName

> `readonly` **typeName**: `string`

Defined in: [packages/core/src/remoteResolver.ts:48](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/remoteResolver.ts#L48)

Proto service `typeName`, e.g. `"orders.v1.OrdersService"`.

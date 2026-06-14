[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ResolverContext

# Interface: ResolverContext

Defined in: [packages/core/src/remoteResolver.ts:29](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/remoteResolver.ts#L29)

Context handed to a [RemoteResolver](../type-aliases/RemoteResolver.md) for a single resolution.

## Properties

### endpoint?

> `readonly` `optional` **endpoint?**: `string`

Defined in: [packages/core/src/remoteResolver.ts:33](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/remoteResolver.ts#L33)

Opaque endpoint hint from `CallOptions.endpoint` (polymorphic deployments).

***

### typeName

> `readonly` **typeName**: `string`

Defined in: [packages/core/src/remoteResolver.ts:31](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/remoteResolver.ts#L31)

Proto service `typeName`, e.g. `"orders.v1.OrdersService"`.

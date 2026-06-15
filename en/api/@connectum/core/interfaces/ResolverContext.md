[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ResolverContext

# Interface: ResolverContext

Defined in: [packages/core/src/remoteResolver.ts:29](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/remoteResolver.ts#L29)

Context handed to a [RemoteResolver](../type-aliases/RemoteResolver.md) for a single resolution.

## Properties

### endpoint?

> `readonly` `optional` **endpoint?**: `string`

Defined in: [packages/core/src/remoteResolver.ts:33](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/remoteResolver.ts#L33)

Opaque endpoint hint from `CallOptions.endpoint` (polymorphic deployments).

***

### typeName

> `readonly` **typeName**: `string`

Defined in: [packages/core/src/remoteResolver.ts:31](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/remoteResolver.ts#L31)

Proto service `typeName`, e.g. `"orders.v1.OrdersService"`.

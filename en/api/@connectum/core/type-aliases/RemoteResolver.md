[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / RemoteResolver

# Type Alias: RemoteResolver

> **RemoteResolver** = (`ctx`) => `Transport` \| `null`

Defined in: [packages/core/src/remoteResolver.ts:40](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/remoteResolver.ts#L40)

Resolve a remote service to a `Transport`, or `null` if there is no route.
Synchronous by contract — see the module note.

## Parameters

### ctx

[`ResolverContext`](../interfaces/ResolverContext.md)

## Returns

`Transport` \| `null`

[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / RemoteResolver

# Type Alias: RemoteResolver

> **RemoteResolver** = (`ctx`) => `Transport` \| `null`

Defined in: [packages/core/src/remoteResolver.ts:40](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/src/remoteResolver.ts#L40)

Resolve a remote service to a `Transport`, or `null` if there is no route.
Synchronous by contract — see the module note.

## Parameters

### ctx

[`ResolverContext`](../interfaces/ResolverContext.md)

## Returns

`Transport` \| `null`

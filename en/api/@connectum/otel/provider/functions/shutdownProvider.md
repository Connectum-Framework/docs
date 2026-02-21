[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / shutdownProvider

# Function: shutdownProvider()

> **shutdownProvider**(): `Promise`\<`void`\>

Defined in: [packages/otel/src/provider.ts:289](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/provider.ts#L289)

Gracefully shutdown the provider and release resources.

After shutdown, subsequent calls to [getProvider](getProvider.md) will create
a fresh provider. If no provider exists, this is a no-op.

## Returns

`Promise`\<`void`\>

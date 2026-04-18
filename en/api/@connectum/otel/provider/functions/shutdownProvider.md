[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / shutdownProvider

# Function: shutdownProvider()

> **shutdownProvider**(): `Promise`\<`void`\>

Defined in: [packages/otel/src/provider.ts:288](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/otel/src/provider.ts#L288)

Gracefully shutdown the provider and release resources.

After shutdown, subsequent calls to [getProvider](getProvider.md) will create
a fresh provider. If no provider exists, this is a no-op.

## Returns

`Promise`\<`void`\>

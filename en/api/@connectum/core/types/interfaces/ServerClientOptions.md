[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ServerClientOptions

# Interface: ServerClientOptions

Defined in: [packages/core/src/types.ts:665](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/types.ts#L665)

Options for [Server.client](Server.md#client).

## Properties

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/core/src/types.ts:671](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/types.ts#L671)

Opaque endpoint hint forwarded to the configured `remoteResolver` when the
requested service is not mounted locally (polymorphic deployments — one
proto served at several endpoints). Ignored for locally-mounted services.

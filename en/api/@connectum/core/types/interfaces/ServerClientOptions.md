[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ServerClientOptions

# Interface: ServerClientOptions

Defined in: [packages/core/src/types.ts:665](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/types.ts#L665)

Options for [Server.client](Server.md#client).

## Properties

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/core/src/types.ts:671](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/types.ts#L671)

Opaque endpoint hint forwarded to the configured `remoteResolver` when the
requested service is not mounted locally (polymorphic deployments — one
proto served at several endpoints). Ignored for locally-mounted services.

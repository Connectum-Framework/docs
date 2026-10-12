[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ServerClientOptions

# Interface: ServerClientOptions

Defined in: [packages/core/src/types.ts:852](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L852)

Options for [Server.client](Server.md#client).

## Properties

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/core/src/types.ts:858](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L858)

Opaque endpoint hint forwarded to the configured `remoteResolver` when the
requested service is not mounted locally (polymorphic deployments — one
proto served at several endpoints). Ignored for locally-mounted services.

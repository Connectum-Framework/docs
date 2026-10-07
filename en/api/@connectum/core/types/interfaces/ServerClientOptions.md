[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / ServerClientOptions

# Interface: ServerClientOptions

Defined in: [packages/core/src/types.ts:827](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L827)

Options for [Server.client](Server.md#client).

## Properties

### endpoint?

> `optional` **endpoint?**: `string`

Defined in: [packages/core/src/types.ts:833](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L833)

Opaque endpoint hint forwarded to the configured `remoteResolver` when the
requested service is not mounted locally (polymorphic deployments — one
proto served at several endpoints). Ignored for locally-mounted services.

[Connectum API Reference](../../../../../index.md) / [@connectum/cli](../../../index.md) / [commands/proto-sync](../index.md) / executeProtoSync

# Function: executeProtoSync()

> **executeProtoSync**(`options`): `Promise`\<`void`\>

Defined in: [commands/proto-sync.ts:47](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/commands/proto-sync.ts#L47)

Fetch service descriptors from a running server and generate client types with `buf`.

With `dryRun: true`, this only lists the services and proto files that would be
synced. A full sync passes the fetched descriptor set to `buf generate` and
removes its temporary descriptor file after the command finishes.

## Parameters

### options

[`ProtoSyncOptions`](../interfaces/ProtoSyncOptions.md)

Proto sync configuration

## Returns

`Promise`\<`void`\>

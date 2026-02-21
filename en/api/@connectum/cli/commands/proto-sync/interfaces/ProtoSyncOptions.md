[Connectum API Reference](../../../../../index.md) / [@connectum/cli](../../../index.md) / [commands/proto-sync](../index.md) / ProtoSyncOptions

# Interface: ProtoSyncOptions

Defined in: [commands/proto-sync.ts:25](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/cli/src/commands/proto-sync.ts#L25)

Options for the proto sync pipeline.

## Properties

### dryRun?

> `optional` **dryRun**: `boolean`

Defined in: [commands/proto-sync.ts:33](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/cli/src/commands/proto-sync.ts#L33)

Show what would be synced without generating

***

### from

> **from**: `string`

Defined in: [commands/proto-sync.ts:27](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/cli/src/commands/proto-sync.ts#L27)

Server URL (e.g., "http://localhost:5000")

***

### out

> **out**: `string`

Defined in: [commands/proto-sync.ts:29](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/cli/src/commands/proto-sync.ts#L29)

Output directory for generated types

***

### template?

> `optional` **template**: `string`

Defined in: [commands/proto-sync.ts:31](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/cli/src/commands/proto-sync.ts#L31)

Path to custom buf.gen.yaml template

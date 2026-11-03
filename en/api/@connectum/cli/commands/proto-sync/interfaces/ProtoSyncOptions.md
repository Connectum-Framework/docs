[Connectum API Reference](../../../../../index.md) / [@connectum/cli](../../../index.md) / [commands/proto-sync](../index.md) / ProtoSyncOptions

# Interface: ProtoSyncOptions

Defined in: [commands/proto-sync.ts:28](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/commands/proto-sync.ts#L28)

Options for the proto sync pipeline.

## Properties

### dryRun?

> `optional` **dryRun?**: `boolean`

Defined in: [commands/proto-sync.ts:36](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/commands/proto-sync.ts#L36)

Show what would be synced without generating

***

### from

> **from**: `string`

Defined in: [commands/proto-sync.ts:30](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/commands/proto-sync.ts#L30)

Server URL (e.g., "http://localhost:5000")

***

### out

> **out**: `string`

Defined in: [commands/proto-sync.ts:32](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/commands/proto-sync.ts#L32)

Output directory for generated types

***

### template?

> `optional` **template?**: `string`

Defined in: [commands/proto-sync.ts:34](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/commands/proto-sync.ts#L34)

Path to custom buf.gen.yaml template

***

### timeoutMs?

> `optional` **timeoutMs?**: `number`

Defined in: [commands/proto-sync.ts:38](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/commands/proto-sync.ts#L38)

Time limit of each reflection request in ms (positive integer; default 10 000).

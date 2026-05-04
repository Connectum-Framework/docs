[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / PublishOptions

# Interface: PublishOptions

Defined in: [packages/events/src/types.ts:59](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events/src/types.ts#L59)

Options for publishing events

## Properties

### group?

> `optional` **group?**: `string`

Defined in: [packages/events/src/types.ts:65](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events/src/types.ts#L65)

Named group tag for workflow grouping

***

### key?

> `optional` **key?**: `string`

Defined in: [packages/events/src/types.ts:69](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events/src/types.ts#L69)

Message key for partitioning (Kafka: partition key, others: ignored)

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [packages/events/src/types.ts:67](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events/src/types.ts#L67)

Additional metadata / headers

***

### sync?

> `optional` **sync?**: `boolean`

Defined in: [packages/events/src/types.ts:63](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events/src/types.ts#L63)

Wait for broker confirmation (default: false = fire-and-forget)

***

### topic?

> `optional` **topic?**: `string`

Defined in: [packages/events/src/types.ts:61](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events/src/types.ts#L61)

Override topic name (default: schema.typeName)

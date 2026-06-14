[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / PublishOptions

# Interface: PublishOptions

Defined in: [packages/events/src/types.ts:59](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/events/src/types.ts#L59)

Options for publishing events

## Properties

### group?

> `optional` **group?**: `string`

Defined in: [packages/events/src/types.ts:63](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/events/src/types.ts#L63)

Named group tag for workflow grouping

***

### key?

> `optional` **key?**: `string`

Defined in: [packages/events/src/types.ts:67](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/events/src/types.ts#L67)

Message key for partitioning (Kafka: partition key, others: ignored)

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [packages/events/src/types.ts:65](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/events/src/types.ts#L65)

Additional metadata / headers

***

### topic?

> `optional` **topic?**: `string`

Defined in: [packages/events/src/types.ts:61](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/events/src/types.ts#L61)

Override topic name (default: schema.typeName)

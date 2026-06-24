[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / PublishOptions

# Interface: PublishOptions

Defined in: [packages/events/src/types.ts:59](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L59)

Options for publishing events

## Properties

### group?

> `optional` **group?**: `string`

Defined in: [packages/events/src/types.ts:63](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L63)

Named group tag for workflow grouping

***

### key?

> `optional` **key?**: `string`

Defined in: [packages/events/src/types.ts:67](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L67)

Message key for partitioning (Kafka: partition key, others: ignored)

***

### messageId?

> `optional` **messageId?**: `string`

Defined in: [packages/events/src/types.ts:75](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L75)

Caller-supplied message identifier the adapter sets on the wire where
supported (AMQP: the `messageId` property; other adapters ignore it).
Primarily for external-contract publishing — in `@connectum/events-amqp`
`externalContract` mode the adapter does not auto-generate a `messageId`,
so set this when the contract requires one.

***

### metadata?

> `optional` **metadata?**: `Record`\<`string`, `string`\>

Defined in: [packages/events/src/types.ts:65](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L65)

Additional metadata / headers

***

### timestamp?

> `optional` **timestamp?**: `number`

Defined in: [packages/events/src/types.ts:82](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L82)

Caller-supplied message timestamp in **Unix epoch seconds**, set on the
wire where supported (AMQP: the `timestamp` property; other adapters
ignore it). Like [messageId](#messageid), mainly for external-contract
publishing where the adapter does not auto-populate it.

***

### topic?

> `optional` **topic?**: `string`

Defined in: [packages/events/src/types.ts:61](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L61)

Override topic name (default: schema.typeName)

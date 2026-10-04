[Connectum API Reference](../../../../index.md) / [@connectum/events-kafka](../../index.md) / [types](../index.md) / KafkaAdapterOptions

# Interface: KafkaAdapterOptions

Defined in: [types.ts:12](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L12)

Options for creating a KafkaAdapter instance.

## Properties

### brokers

> `readonly` **brokers**: `string`[]

Defined in: [types.ts:14](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L14)

Kafka broker addresses (e.g., ["localhost:9092"])

***

### clientId?

> `readonly` `optional` **clientId?**: `string`

Defined in: [types.ts:17](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L17)

Client ID for this producer/consumer (default: "connectum")

***

### consumerOptions?

> `readonly` `optional` **consumerOptions?**: `object`

Defined in: [types.ts:32](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L32)

Consumer-specific options

#### allowAutoTopicCreation?

> `readonly` `optional` **allowAutoTopicCreation?**: `boolean`

Whether Kafka should auto-create topics on subscribe (default: false)

#### fromBeginning?

> `readonly` `optional` **fromBeginning?**: `boolean`

Whether to start consuming from the beginning of topics (default: false)

#### redeliveryDelay?

> `readonly` `optional` **redeliveryDelay?**: `number`

Milliseconds to wait before a message that was not committed is delivered again
(default: 1000).

A message stays uncommitted when the handler throws, calls `nack()` (requeue) or
returns without settling it. Kafka offers no per-message redelivery timer, so the
adapter pauses the affected partition for this long before the redelivery. `0`
disables the pause: the same message is then fetched and handled again at network
speed until it succeeds, is dead-lettered or is rejected with `nack(false)`.

The pause only paces the redelivery loop; it does not end it. On an otherwise idle
consumer the observed gap is a whole fetch cycle (5 s in KafkaJS) even for smaller
values. Must be between 0 and 2147483647 (the longest delay a Node.js timer
supports); `KafkaAdapter()` throws a `RangeError` otherwise.

#### sessionTimeout?

> `readonly` `optional` **sessionTimeout?**: `number`

Session timeout in milliseconds (default: 30000)

***

### kafkaConfig?

> `readonly` `optional` **kafkaConfig?**: `Omit`\<`Partial`\<`KafkaConfig`\>, `"brokers"` \| `"clientId"`\>

Defined in: [types.ts:23](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L23)

Additional KafkaJS configuration overrides.
Merged with brokers and clientId.

***

### producerOptions?

> `readonly` `optional` **producerOptions?**: `object`

Defined in: [types.ts:26](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L26)

Producer-specific options

#### compression?

> `readonly` `optional` **compression?**: `CompressionTypes`

Compression type for produced messages

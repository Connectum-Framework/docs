[Connectum API Reference](../../../../index.md) / [@connectum/events-kafka](../../index.md) / [types](../index.md) / KafkaAdapterOptions

# Interface: KafkaAdapterOptions

Defined in: [types.ts:12](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-kafka/src/types.ts#L12)

Options for creating a KafkaAdapter instance.

## Properties

### brokers

> `readonly` **brokers**: `string`[]

Defined in: [types.ts:14](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-kafka/src/types.ts#L14)

Kafka broker addresses (e.g., ["localhost:9092"])

***

### clientId?

> `readonly` `optional` **clientId?**: `string`

Defined in: [types.ts:17](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-kafka/src/types.ts#L17)

Client ID for this producer/consumer (default: "connectum")

***

### consumerOptions?

> `readonly` `optional` **consumerOptions?**: `object`

Defined in: [types.ts:32](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-kafka/src/types.ts#L32)

Consumer-specific options

#### allowAutoTopicCreation?

> `readonly` `optional` **allowAutoTopicCreation?**: `boolean`

Whether Kafka should auto-create topics on subscribe (default: false)

#### fromBeginning?

> `readonly` `optional` **fromBeginning?**: `boolean`

Whether to start consuming from the beginning of topics (default: false)

#### sessionTimeout?

> `readonly` `optional` **sessionTimeout?**: `number`

Session timeout in milliseconds (default: 30000)

***

### kafkaConfig?

> `readonly` `optional` **kafkaConfig?**: `Omit`\<`Partial`\<`KafkaConfig`\>, `"brokers"` \| `"clientId"`\>

Defined in: [types.ts:23](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-kafka/src/types.ts#L23)

Additional KafkaJS configuration overrides.
Merged with brokers and clientId.

***

### producerOptions?

> `readonly` `optional` **producerOptions?**: `object`

Defined in: [types.ts:26](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-kafka/src/types.ts#L26)

Producer-specific options

#### compression?

> `readonly` `optional` **compression?**: `CompressionTypes`

Compression type for produced messages

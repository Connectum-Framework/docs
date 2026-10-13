[Connectum API Reference](../../../../index.md) / [@connectum/events-kafka](../../index.md) / [types](../index.md) / KafkaRetryOptions

# Interface: KafkaRetryOptions

Defined in: [types.ts:47](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L47)

Retry of the client's own requests and connection attempts. All times are in milliseconds.

## Properties

### factor?

> `readonly` `optional` **factor?**: `number`

Defined in: [types.ts:53](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L53)

Randomization factor applied to each delay.

***

### initialRetryTime?

> `readonly` `optional` **initialRetryTime?**: `number`

Defined in: [types.ts:51](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L51)

Delay before the first retry.

***

### maxRetryTime?

> `readonly` `optional` **maxRetryTime?**: `number`

Defined in: [types.ts:49](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L49)

Longest total time spent retrying one operation.

***

### multiplier?

> `readonly` `optional` **multiplier?**: `number`

Defined in: [types.ts:55](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L55)

Growth factor of the delay between retries.

***

### retries?

> `readonly` `optional` **retries?**: `number`

Defined in: [types.ts:57](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L57)

Maximum number of retries.

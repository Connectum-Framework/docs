[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOptions

# Interface: AmqpQueueOptions

Defined in: [packages/events-amqp/src/types.ts:571](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L571)

Queue assertion options.

## Properties

### deadLetterExchange?

> `readonly` `optional` **deadLetterExchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:592](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L592)

Dead letter exchange name for rejected messages.

***

### deadLetterRoutingKey?

> `readonly` `optional` **deadLetterRoutingKey?**: `string`

Defined in: [packages/events-amqp/src/types.ts:597](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L597)

Dead letter routing key for rejected messages.

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:577](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L577)

Whether the queue should survive broker restarts.

#### Default

```ts
true
```

***

### maxLength?

> `readonly` `optional` **maxLength?**: `number`

Defined in: [packages/events-amqp/src/types.ts:587](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L587)

Maximum number of messages in the queue.

***

### messageTtl?

> `readonly` `optional` **messageTtl?**: `number`

Defined in: [packages/events-amqp/src/types.ts:582](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L582)

Per-message TTL in milliseconds.

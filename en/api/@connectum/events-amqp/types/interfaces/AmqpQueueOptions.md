[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOptions

# Interface: AmqpQueueOptions

Defined in: [packages/events-amqp/src/types.ts:332](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L332)

Queue assertion options.

## Properties

### deadLetterExchange?

> `readonly` `optional` **deadLetterExchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:353](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L353)

Dead letter exchange name for rejected messages.

***

### deadLetterRoutingKey?

> `readonly` `optional` **deadLetterRoutingKey?**: `string`

Defined in: [packages/events-amqp/src/types.ts:358](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L358)

Dead letter routing key for rejected messages.

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:338](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L338)

Whether the queue should survive broker restarts.

#### Default

```ts
true
```

***

### maxLength?

> `readonly` `optional` **maxLength?**: `number`

Defined in: [packages/events-amqp/src/types.ts:348](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L348)

Maximum number of messages in the queue.

***

### messageTtl?

> `readonly` `optional` **messageTtl?**: `number`

Defined in: [packages/events-amqp/src/types.ts:343](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L343)

Per-message TTL in milliseconds.

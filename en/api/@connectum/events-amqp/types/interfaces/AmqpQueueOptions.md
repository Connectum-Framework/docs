[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOptions

# Interface: AmqpQueueOptions

Defined in: [packages/events-amqp/src/types.ts:404](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L404)

Queue assertion options.

## Properties

### deadLetterExchange?

> `readonly` `optional` **deadLetterExchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:425](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L425)

Dead letter exchange name for rejected messages.

***

### deadLetterRoutingKey?

> `readonly` `optional` **deadLetterRoutingKey?**: `string`

Defined in: [packages/events-amqp/src/types.ts:430](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L430)

Dead letter routing key for rejected messages.

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:410](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L410)

Whether the queue should survive broker restarts.

#### Default

```ts
true
```

***

### maxLength?

> `readonly` `optional` **maxLength?**: `number`

Defined in: [packages/events-amqp/src/types.ts:420](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L420)

Maximum number of messages in the queue.

***

### messageTtl?

> `readonly` `optional` **messageTtl?**: `number`

Defined in: [packages/events-amqp/src/types.ts:415](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L415)

Per-message TTL in milliseconds.

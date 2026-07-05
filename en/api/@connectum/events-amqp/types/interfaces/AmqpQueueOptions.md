[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOptions

# Interface: AmqpQueueOptions

Defined in: [packages/events-amqp/src/types.ts:446](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L446)

Queue assertion options.

## Properties

### deadLetterExchange?

> `readonly` `optional` **deadLetterExchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:467](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L467)

Dead letter exchange name for rejected messages.

***

### deadLetterRoutingKey?

> `readonly` `optional` **deadLetterRoutingKey?**: `string`

Defined in: [packages/events-amqp/src/types.ts:472](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L472)

Dead letter routing key for rejected messages.

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:452](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L452)

Whether the queue should survive broker restarts.

#### Default

```ts
true
```

***

### maxLength?

> `readonly` `optional` **maxLength?**: `number`

Defined in: [packages/events-amqp/src/types.ts:462](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L462)

Maximum number of messages in the queue.

***

### messageTtl?

> `readonly` `optional` **messageTtl?**: `number`

Defined in: [packages/events-amqp/src/types.ts:457](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L457)

Per-message TTL in milliseconds.

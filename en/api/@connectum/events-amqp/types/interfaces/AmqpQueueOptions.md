[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOptions

# Interface: AmqpQueueOptions

Defined in: [packages/events-amqp/src/types.ts:710](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L710)

Queue assertion options.

## Properties

### deadLetterExchange?

> `readonly` `optional` **deadLetterExchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:731](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L731)

Dead letter exchange name for rejected messages.

***

### deadLetterRoutingKey?

> `readonly` `optional` **deadLetterRoutingKey?**: `string`

Defined in: [packages/events-amqp/src/types.ts:736](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L736)

Dead letter routing key for rejected messages.

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:716](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L716)

Whether the queue should survive broker restarts.

#### Default

```ts
true
```

***

### maxLength?

> `readonly` `optional` **maxLength?**: `number`

Defined in: [packages/events-amqp/src/types.ts:726](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L726)

Maximum number of messages in the queue.

***

### messageTtl?

> `readonly` `optional` **messageTtl?**: `number`

Defined in: [packages/events-amqp/src/types.ts:721](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L721)

Per-message TTL in milliseconds.

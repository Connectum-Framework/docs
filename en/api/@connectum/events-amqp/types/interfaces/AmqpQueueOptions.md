[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOptions

# Interface: AmqpQueueOptions

Defined in: [packages/events-amqp/src/types.ts:655](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L655)

Queue assertion options.

## Properties

### deadLetterExchange?

> `readonly` `optional` **deadLetterExchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:676](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L676)

Dead letter exchange name for rejected messages.

***

### deadLetterRoutingKey?

> `readonly` `optional` **deadLetterRoutingKey?**: `string`

Defined in: [packages/events-amqp/src/types.ts:681](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L681)

Dead letter routing key for rejected messages.

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:661](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L661)

Whether the queue should survive broker restarts.

#### Default

```ts
true
```

***

### maxLength?

> `readonly` `optional` **maxLength?**: `number`

Defined in: [packages/events-amqp/src/types.ts:671](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L671)

Maximum number of messages in the queue.

***

### messageTtl?

> `readonly` `optional` **messageTtl?**: `number`

Defined in: [packages/events-amqp/src/types.ts:666](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L666)

Per-message TTL in milliseconds.

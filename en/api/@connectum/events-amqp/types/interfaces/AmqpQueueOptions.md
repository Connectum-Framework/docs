[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOptions

# Interface: AmqpQueueOptions

Defined in: [packages/events-amqp/src/types.ts:717](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L717)

Queue assertion options.

## Properties

### deadLetterExchange?

> `readonly` `optional` **deadLetterExchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:738](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L738)

Dead letter exchange name for rejected messages.

***

### deadLetterRoutingKey?

> `readonly` `optional` **deadLetterRoutingKey?**: `string`

Defined in: [packages/events-amqp/src/types.ts:743](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L743)

Dead letter routing key for rejected messages.

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:723](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L723)

Whether the queue should survive broker restarts.

#### Default

```ts
true
```

***

### maxLength?

> `readonly` `optional` **maxLength?**: `number`

Defined in: [packages/events-amqp/src/types.ts:733](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L733)

Maximum number of messages in the queue.

***

### messageTtl?

> `readonly` `optional` **messageTtl?**: `number`

Defined in: [packages/events-amqp/src/types.ts:728](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L728)

Per-message TTL in milliseconds.

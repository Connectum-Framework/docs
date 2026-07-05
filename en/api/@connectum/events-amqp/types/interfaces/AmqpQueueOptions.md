[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOptions

# Interface: AmqpQueueOptions

Defined in: [packages/events-amqp/src/types.ts:486](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L486)

Queue assertion options.

## Properties

### deadLetterExchange?

> `readonly` `optional` **deadLetterExchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:507](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L507)

Dead letter exchange name for rejected messages.

***

### deadLetterRoutingKey?

> `readonly` `optional` **deadLetterRoutingKey?**: `string`

Defined in: [packages/events-amqp/src/types.ts:512](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L512)

Dead letter routing key for rejected messages.

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:492](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L492)

Whether the queue should survive broker restarts.

#### Default

```ts
true
```

***

### maxLength?

> `readonly` `optional` **maxLength?**: `number`

Defined in: [packages/events-amqp/src/types.ts:502](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L502)

Maximum number of messages in the queue.

***

### messageTtl?

> `readonly` `optional` **messageTtl?**: `number`

Defined in: [packages/events-amqp/src/types.ts:497](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L497)

Per-message TTL in milliseconds.

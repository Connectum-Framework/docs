[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOptions

# Interface: AmqpQueueOptions

Defined in: [packages/events-amqp/src/types.ts:778](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L778)

Queue assertion options.

## Properties

### deadLetterExchange?

> `readonly` `optional` **deadLetterExchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:799](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L799)

Dead letter exchange name for rejected messages.

***

### deadLetterRoutingKey?

> `readonly` `optional` **deadLetterRoutingKey?**: `string`

Defined in: [packages/events-amqp/src/types.ts:804](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L804)

Dead letter routing key for rejected messages.

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:784](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L784)

Whether the queue should survive broker restarts.

#### Default

```ts
true
```

***

### maxLength?

> `readonly` `optional` **maxLength?**: `number`

Defined in: [packages/events-amqp/src/types.ts:794](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L794)

Maximum number of messages in the queue.

***

### messageTtl?

> `readonly` `optional` **messageTtl?**: `number`

Defined in: [packages/events-amqp/src/types.ts:789](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L789)

Per-message TTL in milliseconds.

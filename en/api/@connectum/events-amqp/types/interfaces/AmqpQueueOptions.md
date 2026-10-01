[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOptions

# Interface: AmqpQueueOptions

Defined in: [packages/events-amqp/src/types.ts:594](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L594)

Queue assertion options.

## Properties

### deadLetterExchange?

> `readonly` `optional` **deadLetterExchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:615](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L615)

Dead letter exchange name for rejected messages.

***

### deadLetterRoutingKey?

> `readonly` `optional` **deadLetterRoutingKey?**: `string`

Defined in: [packages/events-amqp/src/types.ts:620](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L620)

Dead letter routing key for rejected messages.

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:600](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L600)

Whether the queue should survive broker restarts.

#### Default

```ts
true
```

***

### maxLength?

> `readonly` `optional` **maxLength?**: `number`

Defined in: [packages/events-amqp/src/types.ts:610](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L610)

Maximum number of messages in the queue.

***

### messageTtl?

> `readonly` `optional` **messageTtl?**: `number`

Defined in: [packages/events-amqp/src/types.ts:605](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L605)

Per-message TTL in milliseconds.

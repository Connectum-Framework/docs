[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOptions

# Interface: AmqpQueueOptions

Defined in: [packages/events-amqp/src/types.ts:252](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events-amqp/src/types.ts#L252)

Queue assertion options.

## Properties

### deadLetterExchange?

> `readonly` `optional` **deadLetterExchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:273](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events-amqp/src/types.ts#L273)

Dead letter exchange name for rejected messages.

***

### deadLetterRoutingKey?

> `readonly` `optional` **deadLetterRoutingKey?**: `string`

Defined in: [packages/events-amqp/src/types.ts:278](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events-amqp/src/types.ts#L278)

Dead letter routing key for rejected messages.

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:258](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events-amqp/src/types.ts#L258)

Whether the queue should survive broker restarts.

#### Default

```ts
true
```

***

### maxLength?

> `readonly` `optional` **maxLength?**: `number`

Defined in: [packages/events-amqp/src/types.ts:268](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events-amqp/src/types.ts#L268)

Maximum number of messages in the queue.

***

### messageTtl?

> `readonly` `optional` **messageTtl?**: `number`

Defined in: [packages/events-amqp/src/types.ts:263](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events-amqp/src/types.ts#L263)

Per-message TTL in milliseconds.

[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOptions

# Interface: AmqpQueueOptions

Defined in: [packages/events-amqp/src/types.ts:826](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L826)

Queue assertion options.

## Properties

### deadLetterExchange?

> `readonly` `optional` **deadLetterExchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:849](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L849)

Dead letter exchange name for rejected messages.

***

### deadLetterRoutingKey?

> `readonly` `optional` **deadLetterRoutingKey?**: `string`

Defined in: [packages/events-amqp/src/types.ts:854](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L854)

Dead letter routing key for rejected messages.

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:834](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L834)

Whether a queue for a named consumer group should survive broker restarts.
In the default `assert` mode, ungrouped subscriptions use private,
non-durable, auto-delete queues. `check` and `skip` do not create them.

#### Default

```ts
true
```

***

### maxLength?

> `readonly` `optional` **maxLength?**: `number`

Defined in: [packages/events-amqp/src/types.ts:844](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L844)

Maximum number of messages in the queue.

***

### messageTtl?

> `readonly` `optional` **messageTtl?**: `number`

Defined in: [packages/events-amqp/src/types.ts:839](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L839)

Per-message TTL in milliseconds.

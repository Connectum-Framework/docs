[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOptions

# Interface: AmqpQueueOptions

Defined in: [packages/events-amqp/src/types.ts:863](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L863)

Queue assertion options.

## Properties

### deadLetterExchange?

> `readonly` `optional` **deadLetterExchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:893](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L893)

Dead letter exchange name for rejected messages.

***

### deadLetterRoutingKey?

> `readonly` `optional` **deadLetterRoutingKey?**: `string`

Defined in: [packages/events-amqp/src/types.ts:898](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L898)

Dead letter routing key for rejected messages.

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:878](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L878)

Whether a queue for a named consumer group should survive broker restarts.
In the default `assert` mode, ungrouped subscriptions use private,
non-durable, auto-delete queues. `check` and `skip` do not create them.

`false` for a named group queue works only on a broker that still allows a
non-durable queue that is not exclusive: RabbitMQ 4.3 and later refuse it
with a connection exception (`541`, deprecated feature
`transient_nonexcl_queues`) unless that feature is permitted. The refusal
is reported as `AmqpTopologyError` whose message and `cause` carry the
broker's reply code and text.

#### Default

```ts
true
```

***

### maxLength?

> `readonly` `optional` **maxLength?**: `number`

Defined in: [packages/events-amqp/src/types.ts:888](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L888)

Maximum number of messages in the queue.

***

### messageTtl?

> `readonly` `optional` **messageTtl?**: `number`

Defined in: [packages/events-amqp/src/types.ts:883](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L883)

Per-message TTL in milliseconds.

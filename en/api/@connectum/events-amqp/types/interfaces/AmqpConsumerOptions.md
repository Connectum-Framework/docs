[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpConsumerOptions

# Interface: AmqpConsumerOptions

Defined in: [packages/events-amqp/src/types.ts:813](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L813)

Consumer options.

## Properties

### exclusive?

> `readonly` `optional` **exclusive?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:832](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L832)

Whether the private queue of a subscription without `group` is exclusive
to the subscriber's connection, so the broker removes it with that
connection. RabbitMQ 4.3 and later refuse a queue that is neither
durable nor exclusive, so `false` works only on older brokers or where the
`transient_nonexcl_queues` deprecated feature is permitted. Subscriptions
with `group` use a durable shared queue by default and ignore this option.

#### Default

```ts
true
```

***

### prefetch?

> `readonly` `optional` **prefetch?**: `number`

Defined in: [packages/events-amqp/src/types.ts:820](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L820)

Prefetch count (QoS) — how many unacknowledged messages
a consumer can have at a time.

#### Default

```ts
10
```

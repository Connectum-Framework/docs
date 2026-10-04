[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpConsumerOptions

# Interface: AmqpConsumerOptions

Defined in: [packages/events-amqp/src/types.ts:742](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L742)

Consumer options.

## Properties

### exclusive?

> `readonly` `optional` **exclusive?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:756](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L756)

Whether the consumer is exclusive to this connection.

#### Default

```ts
false
```

***

### prefetch?

> `readonly` `optional` **prefetch?**: `number`

Defined in: [packages/events-amqp/src/types.ts:749](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L749)

Prefetch count (QoS) — how many unacknowledged messages
a consumer can have at a time.

#### Default

```ts
10
```

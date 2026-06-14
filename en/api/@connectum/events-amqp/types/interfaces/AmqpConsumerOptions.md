[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpConsumerOptions

# Interface: AmqpConsumerOptions

Defined in: [packages/events-amqp/src/types.ts:284](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events-amqp/src/types.ts#L284)

Consumer options.

## Properties

### exclusive?

> `readonly` `optional` **exclusive?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:298](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events-amqp/src/types.ts#L298)

Whether the consumer is exclusive to this connection.

#### Default

```ts
false
```

***

### prefetch?

> `readonly` `optional` **prefetch?**: `number`

Defined in: [packages/events-amqp/src/types.ts:291](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events-amqp/src/types.ts#L291)

Prefetch count (QoS) — how many unacknowledged messages
a consumer can have at a time.

#### Default

```ts
10
```

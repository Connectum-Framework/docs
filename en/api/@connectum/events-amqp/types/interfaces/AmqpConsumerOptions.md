[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpConsumerOptions

# Interface: AmqpConsumerOptions

Defined in: [packages/events-amqp/src/types.ts:603](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L603)

Consumer options.

## Properties

### exclusive?

> `readonly` `optional` **exclusive?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:617](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L617)

Whether the consumer is exclusive to this connection.

#### Default

```ts
false
```

***

### prefetch?

> `readonly` `optional` **prefetch?**: `number`

Defined in: [packages/events-amqp/src/types.ts:610](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L610)

Prefetch count (QoS) — how many unacknowledged messages
a consumer can have at a time.

#### Default

```ts
10
```

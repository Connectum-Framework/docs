[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpConsumerOptions

# Interface: AmqpConsumerOptions

Defined in: [packages/events-amqp/src/types.ts:364](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L364)

Consumer options.

## Properties

### exclusive?

> `readonly` `optional` **exclusive?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:378](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L378)

Whether the consumer is exclusive to this connection.

#### Default

```ts
false
```

***

### prefetch?

> `readonly` `optional` **prefetch?**: `number`

Defined in: [packages/events-amqp/src/types.ts:371](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L371)

Prefetch count (QoS) — how many unacknowledged messages
a consumer can have at a time.

#### Default

```ts
10
```

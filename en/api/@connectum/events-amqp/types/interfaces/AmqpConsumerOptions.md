[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpConsumerOptions

# Interface: AmqpConsumerOptions

Defined in: [packages/events-amqp/src/types.ts:518](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L518)

Consumer options.

## Properties

### exclusive?

> `readonly` `optional` **exclusive?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:532](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L532)

Whether the consumer is exclusive to this connection.

#### Default

```ts
false
```

***

### prefetch?

> `readonly` `optional` **prefetch?**: `number`

Defined in: [packages/events-amqp/src/types.ts:525](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L525)

Prefetch count (QoS) — how many unacknowledged messages
a consumer can have at a time.

#### Default

```ts
10
```

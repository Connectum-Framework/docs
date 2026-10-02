[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpConsumerOptions

# Interface: AmqpConsumerOptions

Defined in: [packages/events-amqp/src/types.ts:626](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L626)

Consumer options.

## Properties

### exclusive?

> `readonly` `optional` **exclusive?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:640](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L640)

Whether the consumer is exclusive to this connection.

#### Default

```ts
false
```

***

### prefetch?

> `readonly` `optional` **prefetch?**: `number`

Defined in: [packages/events-amqp/src/types.ts:633](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L633)

Prefetch count (QoS) — how many unacknowledged messages
a consumer can have at a time.

#### Default

```ts
10
```

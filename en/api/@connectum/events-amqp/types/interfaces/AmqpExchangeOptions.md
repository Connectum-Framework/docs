[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpExchangeOptions

# Interface: AmqpExchangeOptions

Defined in: [packages/events-amqp/src/types.ts:467](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L467)

Exchange assertion options.

## Properties

### autoDelete?

> `readonly` `optional` **autoDelete?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:480](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L480)

Whether the exchange is deleted when the last queue unbinds.

#### Default

```ts
false
```

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:473](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L473)

Whether the exchange should survive broker restarts.

#### Default

```ts
true
```

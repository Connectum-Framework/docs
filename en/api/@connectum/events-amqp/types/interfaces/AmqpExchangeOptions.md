[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpExchangeOptions

# Interface: AmqpExchangeOptions

Defined in: [packages/events-amqp/src/types.ts:844](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L844)

Exchange assertion options.

## Properties

### autoDelete?

> `readonly` `optional` **autoDelete?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:857](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L857)

Whether the exchange is deleted when the last queue unbinds.

#### Default

```ts
false
```

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:850](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L850)

Whether the exchange should survive broker restarts.

#### Default

```ts
true
```

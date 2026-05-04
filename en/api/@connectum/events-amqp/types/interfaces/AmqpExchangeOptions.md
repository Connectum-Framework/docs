[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpExchangeOptions

# Interface: AmqpExchangeOptions

Defined in: [types.ts:61](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events-amqp/src/types.ts#L61)

Exchange assertion options.

## Properties

### autoDelete?

> `readonly` `optional` **autoDelete?**: `boolean`

Defined in: [types.ts:74](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events-amqp/src/types.ts#L74)

Whether the exchange is deleted when the last queue unbinds.

#### Default

```ts
false
```

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [types.ts:67](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events-amqp/src/types.ts#L67)

Whether the exchange should survive broker restarts.

#### Default

```ts
true
```

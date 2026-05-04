[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpPublisherOptions

# Interface: AmqpPublisherOptions

Defined in: [types.ts:132](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events-amqp/src/types.ts#L132)

Publisher options.

## Properties

### mandatory?

> `readonly` `optional` **mandatory?**: `boolean`

Defined in: [types.ts:145](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events-amqp/src/types.ts#L145)

Whether the message should be returned if it cannot be routed.

#### Default

```ts
false
```

***

### persistent?

> `readonly` `optional` **persistent?**: `boolean`

Defined in: [types.ts:138](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events-amqp/src/types.ts#L138)

Whether messages should be persisted to disk (deliveryMode=2).

#### Default

```ts
true
```

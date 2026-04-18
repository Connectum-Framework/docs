[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpPublisherOptions

# Interface: AmqpPublisherOptions

Defined in: [types.ts:132](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/events-amqp/src/types.ts#L132)

Publisher options.

## Properties

### mandatory?

> `readonly` `optional` **mandatory?**: `boolean`

Defined in: [types.ts:145](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/events-amqp/src/types.ts#L145)

Whether the message should be returned if it cannot be routed.

#### Default

```ts
false
```

***

### persistent?

> `readonly` `optional` **persistent?**: `boolean`

Defined in: [types.ts:138](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/events-amqp/src/types.ts#L138)

Whether messages should be persisted to disk (deliveryMode=2).

#### Default

```ts
true
```

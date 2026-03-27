[Connectum API Reference](../index.md) / AmqpQueueOptions

# Interface: AmqpQueueOptions

Defined in: [types.ts:80](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events-amqp/src/types.ts#L80)

Queue assertion options.

## Properties

### deadLetterExchange?

> `readonly` `optional` **deadLetterExchange**: `string`

Defined in: [types.ts:101](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events-amqp/src/types.ts#L101)

Dead letter exchange name for rejected messages.

***

### deadLetterRoutingKey?

> `readonly` `optional` **deadLetterRoutingKey**: `string`

Defined in: [types.ts:106](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events-amqp/src/types.ts#L106)

Dead letter routing key for rejected messages.

***

### durable?

> `readonly` `optional` **durable**: `boolean`

Defined in: [types.ts:86](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events-amqp/src/types.ts#L86)

Whether the queue should survive broker restarts.

#### Default

```ts
true
```

***

### maxLength?

> `readonly` `optional` **maxLength**: `number`

Defined in: [types.ts:96](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events-amqp/src/types.ts#L96)

Maximum number of messages in the queue.

***

### messageTtl?

> `readonly` `optional` **messageTtl**: `number`

Defined in: [types.ts:91](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events-amqp/src/types.ts#L91)

Per-message TTL in milliseconds.

[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOverride

# Interface: AmqpQueueOverride

Defined in: [packages/events-amqp/src/types.ts:237](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L237)

External queue override for a consumer group.

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:241](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L241)

Raw AMQP arguments used when asserting the queue (assert mode only).

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:243](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L243)

#### Default

```ts
true
```

***

### queue

> `readonly` **queue**: `string`

Defined in: [packages/events-amqp/src/types.ts:239](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L239)

Externally-defined queue name to consume from.

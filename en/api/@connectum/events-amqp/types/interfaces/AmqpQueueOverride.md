[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOverride

# Interface: AmqpQueueOverride

Defined in: [packages/events-amqp/src/types.ts:411](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L411)

External queue override for a consumer group.

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:415](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L415)

Raw AMQP arguments used when asserting the queue (assert mode only).

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:417](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L417)

#### Default

```ts
true
```

***

### queue

> `readonly` **queue**: `string`

Defined in: [packages/events-amqp/src/types.ts:413](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L413)

Externally-defined queue name to consume from.

[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOverride

# Interface: AmqpQueueOverride

Defined in: [packages/events-amqp/src/types.ts:331](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L331)

External queue override for a consumer group.

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:335](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L335)

Raw AMQP arguments used when asserting the queue (assert mode only).

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:337](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L337)

#### Default

```ts
true
```

***

### queue

> `readonly` **queue**: `string`

Defined in: [packages/events-amqp/src/types.ts:333](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L333)

Externally-defined queue name to consume from.

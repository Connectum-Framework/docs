[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOverride

# Interface: AmqpQueueOverride

Defined in: [packages/events-amqp/src/types.ts:341](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L341)

External queue override for a consumer group.

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:345](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L345)

Raw AMQP arguments used when asserting the queue (assert mode only).

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:347](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L347)

#### Default

```ts
true
```

***

### queue

> `readonly` **queue**: `string`

Defined in: [packages/events-amqp/src/types.ts:343](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L343)

Externally-defined queue name to consume from.

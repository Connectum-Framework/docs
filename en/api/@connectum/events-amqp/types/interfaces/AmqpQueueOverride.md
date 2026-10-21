[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOverride

# Interface: AmqpQueueOverride

Defined in: [packages/events-amqp/src/types.ts:420](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L420)

External queue override for a consumer group.

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:424](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L424)

Raw AMQP arguments used when asserting the queue (assert mode only).

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:426](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L426)

#### Default

```ts
true
```

***

### queue

> `readonly` **queue**: `string`

Defined in: [packages/events-amqp/src/types.ts:422](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L422)

Externally-defined queue name to consume from.

[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOverride

# Interface: AmqpQueueOverride

Defined in: [packages/events-amqp/src/types.ts:240](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L240)

External queue override for a consumer group.

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:244](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L244)

Raw AMQP arguments used when asserting the queue (assert mode only).

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:246](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L246)

#### Default

```ts
true
```

***

### queue

> `readonly` **queue**: `string`

Defined in: [packages/events-amqp/src/types.ts:242](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L242)

Externally-defined queue name to consume from.

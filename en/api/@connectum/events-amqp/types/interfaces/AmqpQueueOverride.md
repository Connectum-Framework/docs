[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOverride

# Interface: AmqpQueueOverride

Defined in: [packages/events-amqp/src/types.ts:279](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L279)

External queue override for a consumer group.

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:283](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L283)

Raw AMQP arguments used when asserting the queue (assert mode only).

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:285](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L285)

#### Default

```ts
true
```

***

### queue

> `readonly` **queue**: `string`

Defined in: [packages/events-amqp/src/types.ts:281](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L281)

Externally-defined queue name to consume from.

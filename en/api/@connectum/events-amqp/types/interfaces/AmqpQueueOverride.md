[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOverride

# Interface: AmqpQueueOverride

Defined in: [packages/events-amqp/src/types.ts:428](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L428)

External queue override for a consumer group.

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:432](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L432)

Raw AMQP arguments used when asserting the queue (assert mode only).

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:434](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L434)

#### Default

```ts
true
```

***

### queue

> `readonly` **queue**: `string`

Defined in: [packages/events-amqp/src/types.ts:430](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L430)

Externally-defined queue name to consume from.

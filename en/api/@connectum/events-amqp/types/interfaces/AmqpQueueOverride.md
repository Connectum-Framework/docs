[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOverride

# Interface: AmqpQueueOverride

Defined in: [packages/events-amqp/src/types.ts:278](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L278)

External queue override for a consumer group.

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:282](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L282)

Raw AMQP arguments used when asserting the queue (assert mode only).

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:284](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L284)

#### Default

```ts
true
```

***

### queue

> `readonly` **queue**: `string`

Defined in: [packages/events-amqp/src/types.ts:280](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L280)

Externally-defined queue name to consume from.

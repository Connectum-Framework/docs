[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOverride

# Interface: AmqpQueueOverride

Defined in: [packages/events-amqp/src/types.ts:437](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L437)

External queue override for a consumer group.

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:441](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L441)

Raw AMQP arguments used when asserting the queue (assert mode only).

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:443](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L443)

#### Default

```ts
true
```

***

### queue

> `readonly` **queue**: `string`

Defined in: [packages/events-amqp/src/types.ts:439](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L439)

Externally-defined queue name to consume from.

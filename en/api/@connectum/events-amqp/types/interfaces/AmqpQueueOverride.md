[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOverride

# Interface: AmqpQueueOverride

Defined in: [packages/events-amqp/src/types.ts:385](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L385)

External queue override for a consumer group.

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:389](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L389)

Raw AMQP arguments used when asserting the queue (assert mode only).

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:391](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L391)

#### Default

```ts
true
```

***

### queue

> `readonly` **queue**: `string`

Defined in: [packages/events-amqp/src/types.ts:387](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L387)

Externally-defined queue name to consume from.

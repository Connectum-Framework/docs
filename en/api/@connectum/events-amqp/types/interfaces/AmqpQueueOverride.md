[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpQueueOverride

# Interface: AmqpQueueOverride

Defined in: [packages/events-amqp/src/types.ts:369](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L369)

External queue override for a consumer group.

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:373](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L373)

Raw AMQP arguments used when asserting the queue (assert mode only).

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:375](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L375)

#### Default

```ts
true
```

***

### queue

> `readonly` **queue**: `string`

Defined in: [packages/events-amqp/src/types.ts:371](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L371)

Externally-defined queue name to consume from.

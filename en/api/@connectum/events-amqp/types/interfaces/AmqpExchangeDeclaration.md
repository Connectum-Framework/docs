[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpExchangeDeclaration

# Interface: AmqpExchangeDeclaration

Defined in: [packages/events-amqp/src/types.ts:381](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L381)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:387](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L387)

Raw AMQP arguments passthrough.

***

### autoDelete?

> `readonly` `optional` **autoDelete?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:385](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L385)

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:384](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L384)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/events-amqp/src/types.ts:382](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L382)

***

### type

> `readonly` **type**: `"headers"` \| `"topic"` \| `"direct"` \| `"fanout"`

Defined in: [packages/events-amqp/src/types.ts:383](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L383)

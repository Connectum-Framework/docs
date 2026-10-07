[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpExchangeDeclaration

# Interface: AmqpExchangeDeclaration

Defined in: [packages/events-amqp/src/types.ts:355](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L355)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:361](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L361)

Raw AMQP arguments passthrough.

***

### autoDelete?

> `readonly` `optional` **autoDelete?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:359](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L359)

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:358](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L358)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/events-amqp/src/types.ts:356](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L356)

***

### type

> `readonly` **type**: `"headers"` \| `"topic"` \| `"direct"` \| `"fanout"`

Defined in: [packages/events-amqp/src/types.ts:357](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L357)

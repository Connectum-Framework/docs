[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpExchangeDeclaration

# Interface: AmqpExchangeDeclaration

Defined in: [packages/events-amqp/src/types.ts:339](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L339)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:345](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L345)

Raw AMQP arguments passthrough.

***

### autoDelete?

> `readonly` `optional` **autoDelete?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:343](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L343)

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:342](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L342)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/events-amqp/src/types.ts:340](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L340)

***

### type

> `readonly` **type**: `"headers"` \| `"topic"` \| `"direct"` \| `"fanout"`

Defined in: [packages/events-amqp/src/types.ts:341](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L341)

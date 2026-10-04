[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpExchangeDeclaration

# Interface: AmqpExchangeDeclaration

Defined in: [packages/events-amqp/src/types.ts:335](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L335)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:341](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L341)

Raw AMQP arguments passthrough.

***

### autoDelete?

> `readonly` `optional` **autoDelete?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:339](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L339)

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:338](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L338)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/events-amqp/src/types.ts:336](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L336)

***

### type

> `readonly` **type**: `"headers"` \| `"topic"` \| `"direct"` \| `"fanout"`

Defined in: [packages/events-amqp/src/types.ts:337](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L337)

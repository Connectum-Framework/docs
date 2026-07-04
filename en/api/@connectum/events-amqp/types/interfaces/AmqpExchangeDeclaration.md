[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpExchangeDeclaration

# Interface: AmqpExchangeDeclaration

Defined in: [packages/events-amqp/src/types.ts:207](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L207)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:213](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L213)

Raw AMQP arguments passthrough.

***

### autoDelete?

> `readonly` `optional` **autoDelete?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:211](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L211)

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:210](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L210)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/events-amqp/src/types.ts:208](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L208)

***

### type

> `readonly` **type**: `"headers"` \| `"topic"` \| `"direct"` \| `"fanout"`

Defined in: [packages/events-amqp/src/types.ts:209](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L209)

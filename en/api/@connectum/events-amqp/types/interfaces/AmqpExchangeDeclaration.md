[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpExchangeDeclaration

# Interface: AmqpExchangeDeclaration

Defined in: [packages/events-amqp/src/types.ts:407](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L407)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:413](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L413)

Raw AMQP arguments passthrough.

***

### autoDelete?

> `readonly` `optional` **autoDelete?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:411](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L411)

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:410](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L410)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/events-amqp/src/types.ts:408](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L408)

***

### type

> `readonly` **type**: `"headers"` \| `"topic"` \| `"direct"` \| `"fanout"`

Defined in: [packages/events-amqp/src/types.ts:409](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L409)

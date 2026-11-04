[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpExchangeDeclaration

# Interface: AmqpExchangeDeclaration

Defined in: [packages/events-amqp/src/types.ts:398](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L398)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:404](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L404)

Raw AMQP arguments passthrough.

***

### autoDelete?

> `readonly` `optional` **autoDelete?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:402](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L402)

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:401](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L401)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/events-amqp/src/types.ts:399](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L399)

***

### type

> `readonly` **type**: `"headers"` \| `"topic"` \| `"direct"` \| `"fanout"`

Defined in: [packages/events-amqp/src/types.ts:400](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L400)

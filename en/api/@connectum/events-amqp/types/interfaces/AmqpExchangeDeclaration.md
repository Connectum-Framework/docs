[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpExchangeDeclaration

# Interface: AmqpExchangeDeclaration

Defined in: [packages/events-amqp/src/types.ts:311](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L311)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:317](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L317)

Raw AMQP arguments passthrough.

***

### autoDelete?

> `readonly` `optional` **autoDelete?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:315](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L315)

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:314](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L314)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/events-amqp/src/types.ts:312](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L312)

***

### type

> `readonly` **type**: `"headers"` \| `"topic"` \| `"direct"` \| `"fanout"`

Defined in: [packages/events-amqp/src/types.ts:313](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L313)

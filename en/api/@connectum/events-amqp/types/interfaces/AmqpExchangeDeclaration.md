[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpExchangeDeclaration

# Interface: AmqpExchangeDeclaration

Defined in: [packages/events-amqp/src/types.ts:390](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L390)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:396](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L396)

Raw AMQP arguments passthrough.

***

### autoDelete?

> `readonly` `optional` **autoDelete?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:394](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L394)

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:393](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L393)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/events-amqp/src/types.ts:391](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L391)

***

### type

> `readonly` **type**: `"headers"` \| `"topic"` \| `"direct"` \| `"fanout"`

Defined in: [packages/events-amqp/src/types.ts:392](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L392)

[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpExchangeDeclaration

# Interface: AmqpExchangeDeclaration

Defined in: [packages/events-amqp/src/types.ts:301](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L301)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:307](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L307)

Raw AMQP arguments passthrough.

***

### autoDelete?

> `readonly` `optional` **autoDelete?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:305](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L305)

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:304](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L304)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/events-amqp/src/types.ts:302](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L302)

***

### type

> `readonly` **type**: `"headers"` \| `"topic"` \| `"direct"` \| `"fanout"`

Defined in: [packages/events-amqp/src/types.ts:303](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L303)

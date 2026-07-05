[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpExchangeDeclaration

# Interface: AmqpExchangeDeclaration

Defined in: [packages/events-amqp/src/types.ts:249](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L249)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:255](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L255)

Raw AMQP arguments passthrough.

***

### autoDelete?

> `readonly` `optional` **autoDelete?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:253](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L253)

***

### durable?

> `readonly` `optional` **durable?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:252](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L252)

***

### name

> `readonly` **name**: `string`

Defined in: [packages/events-amqp/src/types.ts:250](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L250)

***

### type

> `readonly` **type**: `"headers"` \| `"topic"` \| `"direct"` \| `"fanout"`

Defined in: [packages/events-amqp/src/types.ts:251](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L251)

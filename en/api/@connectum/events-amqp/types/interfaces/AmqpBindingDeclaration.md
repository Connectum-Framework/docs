[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpBindingDeclaration

# Interface: AmqpBindingDeclaration

Defined in: [packages/events-amqp/src/types.ts:399](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L399)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:407](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L407)

***

### exchange?

> `readonly` `optional` **exchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:403](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L403)

Destination exchange name (exchange-to-exchange binding).

***

### queue?

> `readonly` `optional` **queue?**: `string`

Defined in: [packages/events-amqp/src/types.ts:401](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L401)

Destination queue name. Set exactly one of `queue` and `exchange`; the result of setting both is not part of the contract.

***

### routingKey

> `readonly` **routingKey**: `string`

Defined in: [packages/events-amqp/src/types.ts:406](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L406)

***

### source

> `readonly` **source**: `string`

Defined in: [packages/events-amqp/src/types.ts:405](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L405)

Source exchange.

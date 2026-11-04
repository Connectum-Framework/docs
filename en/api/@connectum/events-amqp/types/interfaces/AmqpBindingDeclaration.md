[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpBindingDeclaration

# Interface: AmqpBindingDeclaration

Defined in: [packages/events-amqp/src/types.ts:416](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L416)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:424](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L424)

***

### exchange?

> `readonly` `optional` **exchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:420](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L420)

Destination exchange name (exchange-to-exchange binding).

***

### queue?

> `readonly` `optional` **queue?**: `string`

Defined in: [packages/events-amqp/src/types.ts:418](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L418)

Destination queue name. Set exactly one of `queue` and `exchange`; the result of setting both is not part of the contract.

***

### routingKey

> `readonly` **routingKey**: `string`

Defined in: [packages/events-amqp/src/types.ts:423](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L423)

***

### source

> `readonly` **source**: `string`

Defined in: [packages/events-amqp/src/types.ts:422](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L422)

Source exchange.

[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpBindingDeclaration

# Interface: AmqpBindingDeclaration

Defined in: [packages/events-amqp/src/types.ts:425](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L425)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:433](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L433)

***

### exchange?

> `readonly` `optional` **exchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:429](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L429)

Destination exchange name (exchange-to-exchange binding).

***

### queue?

> `readonly` `optional` **queue?**: `string`

Defined in: [packages/events-amqp/src/types.ts:427](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L427)

Destination queue name. Set exactly one of `queue` and `exchange`; the result of setting both is not part of the contract.

***

### routingKey

> `readonly` **routingKey**: `string`

Defined in: [packages/events-amqp/src/types.ts:432](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L432)

***

### source

> `readonly` **source**: `string`

Defined in: [packages/events-amqp/src/types.ts:431](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L431)

Source exchange.

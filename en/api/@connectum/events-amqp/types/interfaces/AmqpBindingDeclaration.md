[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpBindingDeclaration

# Interface: AmqpBindingDeclaration

Defined in: [packages/events-amqp/src/types.ts:187](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L187)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:195](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L195)

***

### exchange?

> `readonly` `optional` **exchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:191](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L191)

Destination exchange name (exchange-to-exchange binding).

***

### queue?

> `readonly` `optional` **queue?**: `string`

Defined in: [packages/events-amqp/src/types.ts:189](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L189)

Destination queue name (queue binding) — mutually exclusive with `exchange`.

***

### routingKey

> `readonly` **routingKey**: `string`

Defined in: [packages/events-amqp/src/types.ts:194](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L194)

***

### source

> `readonly` **source**: `string`

Defined in: [packages/events-amqp/src/types.ts:193](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L193)

Source exchange.

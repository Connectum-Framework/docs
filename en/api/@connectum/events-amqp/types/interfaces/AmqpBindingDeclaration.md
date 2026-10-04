[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpBindingDeclaration

# Interface: AmqpBindingDeclaration

Defined in: [packages/events-amqp/src/types.ts:353](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L353)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:361](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L361)

***

### exchange?

> `readonly` `optional` **exchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:357](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L357)

Destination exchange name (exchange-to-exchange binding).

***

### queue?

> `readonly` `optional` **queue?**: `string`

Defined in: [packages/events-amqp/src/types.ts:355](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L355)

Destination queue name (queue binding) — mutually exclusive with `exchange`.

***

### routingKey

> `readonly` **routingKey**: `string`

Defined in: [packages/events-amqp/src/types.ts:360](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L360)

***

### source

> `readonly` **source**: `string`

Defined in: [packages/events-amqp/src/types.ts:359](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L359)

Source exchange.

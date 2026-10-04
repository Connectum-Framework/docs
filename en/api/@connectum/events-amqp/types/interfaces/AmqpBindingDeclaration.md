[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpBindingDeclaration

# Interface: AmqpBindingDeclaration

Defined in: [packages/events-amqp/src/types.ts:357](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L357)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:365](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L365)

***

### exchange?

> `readonly` `optional` **exchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:361](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L361)

Destination exchange name (exchange-to-exchange binding).

***

### queue?

> `readonly` `optional` **queue?**: `string`

Defined in: [packages/events-amqp/src/types.ts:359](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L359)

Destination queue name (queue binding) — mutually exclusive with `exchange`.

***

### routingKey

> `readonly` **routingKey**: `string`

Defined in: [packages/events-amqp/src/types.ts:364](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L364)

***

### source

> `readonly` **source**: `string`

Defined in: [packages/events-amqp/src/types.ts:363](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L363)

Source exchange.

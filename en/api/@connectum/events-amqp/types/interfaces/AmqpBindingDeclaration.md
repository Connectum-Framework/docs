[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpBindingDeclaration

# Interface: AmqpBindingDeclaration

Defined in: [packages/events-amqp/src/types.ts:329](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L329)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:337](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L337)

***

### exchange?

> `readonly` `optional` **exchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:333](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L333)

Destination exchange name (exchange-to-exchange binding).

***

### queue?

> `readonly` `optional` **queue?**: `string`

Defined in: [packages/events-amqp/src/types.ts:331](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L331)

Destination queue name (queue binding) — mutually exclusive with `exchange`.

***

### routingKey

> `readonly` **routingKey**: `string`

Defined in: [packages/events-amqp/src/types.ts:336](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L336)

***

### source

> `readonly` **source**: `string`

Defined in: [packages/events-amqp/src/types.ts:335](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L335)

Source exchange.

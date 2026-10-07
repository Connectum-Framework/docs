[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpBindingDeclaration

# Interface: AmqpBindingDeclaration

Defined in: [packages/events-amqp/src/types.ts:373](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L373)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:381](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L381)

***

### exchange?

> `readonly` `optional` **exchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:377](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L377)

Destination exchange name (exchange-to-exchange binding).

***

### queue?

> `readonly` `optional` **queue?**: `string`

Defined in: [packages/events-amqp/src/types.ts:375](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L375)

Destination queue name (queue binding) — mutually exclusive with `exchange`.

***

### routingKey

> `readonly` **routingKey**: `string`

Defined in: [packages/events-amqp/src/types.ts:380](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L380)

***

### source

> `readonly` **source**: `string`

Defined in: [packages/events-amqp/src/types.ts:379](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L379)

Source exchange.

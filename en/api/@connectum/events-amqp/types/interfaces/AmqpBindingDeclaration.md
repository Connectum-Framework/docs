[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpBindingDeclaration

# Interface: AmqpBindingDeclaration

Defined in: [packages/events-amqp/src/types.ts:266](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L266)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:274](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L274)

***

### exchange?

> `readonly` `optional` **exchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:270](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L270)

Destination exchange name (exchange-to-exchange binding).

***

### queue?

> `readonly` `optional` **queue?**: `string`

Defined in: [packages/events-amqp/src/types.ts:268](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L268)

Destination queue name (queue binding) — mutually exclusive with `exchange`.

***

### routingKey

> `readonly` **routingKey**: `string`

Defined in: [packages/events-amqp/src/types.ts:273](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L273)

***

### source

> `readonly` **source**: `string`

Defined in: [packages/events-amqp/src/types.ts:272](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L272)

Source exchange.

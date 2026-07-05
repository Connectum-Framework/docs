[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpBindingDeclaration

# Interface: AmqpBindingDeclaration

Defined in: [packages/events-amqp/src/types.ts:267](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L267)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:275](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L275)

***

### exchange?

> `readonly` `optional` **exchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:271](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L271)

Destination exchange name (exchange-to-exchange binding).

***

### queue?

> `readonly` `optional` **queue?**: `string`

Defined in: [packages/events-amqp/src/types.ts:269](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L269)

Destination queue name (queue binding) — mutually exclusive with `exchange`.

***

### routingKey

> `readonly` **routingKey**: `string`

Defined in: [packages/events-amqp/src/types.ts:274](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L274)

***

### source

> `readonly` **source**: `string`

Defined in: [packages/events-amqp/src/types.ts:273](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L273)

Source exchange.

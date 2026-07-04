[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpBindingDeclaration

# Interface: AmqpBindingDeclaration

Defined in: [packages/events-amqp/src/types.ts:225](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L225)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:233](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L233)

***

### exchange?

> `readonly` `optional` **exchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:229](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L229)

Destination exchange name (exchange-to-exchange binding).

***

### queue?

> `readonly` `optional` **queue?**: `string`

Defined in: [packages/events-amqp/src/types.ts:227](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L227)

Destination queue name (queue binding) — mutually exclusive with `exchange`.

***

### routingKey

> `readonly` **routingKey**: `string`

Defined in: [packages/events-amqp/src/types.ts:232](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L232)

***

### source

> `readonly` **source**: `string`

Defined in: [packages/events-amqp/src/types.ts:231](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L231)

Source exchange.

[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpBindingDeclaration

# Interface: AmqpBindingDeclaration

Defined in: [packages/events-amqp/src/types.ts:228](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L228)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:236](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L236)

***

### exchange?

> `readonly` `optional` **exchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:232](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L232)

Destination exchange name (exchange-to-exchange binding).

***

### queue?

> `readonly` `optional` **queue?**: `string`

Defined in: [packages/events-amqp/src/types.ts:230](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L230)

Destination queue name (queue binding) — mutually exclusive with `exchange`.

***

### routingKey

> `readonly` **routingKey**: `string`

Defined in: [packages/events-amqp/src/types.ts:235](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L235)

***

### source

> `readonly` **source**: `string`

Defined in: [packages/events-amqp/src/types.ts:234](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L234)

Source exchange.

[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpBindingDeclaration

# Interface: AmqpBindingDeclaration

Defined in: [packages/events-amqp/src/types.ts:319](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L319)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:327](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L327)

***

### exchange?

> `readonly` `optional` **exchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:323](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L323)

Destination exchange name (exchange-to-exchange binding).

***

### queue?

> `readonly` `optional` **queue?**: `string`

Defined in: [packages/events-amqp/src/types.ts:321](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L321)

Destination queue name (queue binding) — mutually exclusive with `exchange`.

***

### routingKey

> `readonly` **routingKey**: `string`

Defined in: [packages/events-amqp/src/types.ts:326](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L326)

***

### source

> `readonly` **source**: `string`

Defined in: [packages/events-amqp/src/types.ts:325](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L325)

Source exchange.

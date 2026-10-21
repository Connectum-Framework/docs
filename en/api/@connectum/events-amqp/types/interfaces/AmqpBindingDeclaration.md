[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpBindingDeclaration

# Interface: AmqpBindingDeclaration

Defined in: [packages/events-amqp/src/types.ts:408](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L408)

## Properties

### arguments?

> `readonly` `optional` **arguments?**: `Record`\<`string`, `unknown`\>

Defined in: [packages/events-amqp/src/types.ts:416](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L416)

***

### exchange?

> `readonly` `optional` **exchange?**: `string`

Defined in: [packages/events-amqp/src/types.ts:412](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L412)

Destination exchange name (exchange-to-exchange binding).

***

### queue?

> `readonly` `optional` **queue?**: `string`

Defined in: [packages/events-amqp/src/types.ts:410](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L410)

Destination queue name. Set exactly one of `queue` and `exchange`; the result of setting both is not part of the contract.

***

### routingKey

> `readonly` **routingKey**: `string`

Defined in: [packages/events-amqp/src/types.ts:415](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L415)

***

### source

> `readonly` **source**: `string`

Defined in: [packages/events-amqp/src/types.ts:414](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L414)

Source exchange.

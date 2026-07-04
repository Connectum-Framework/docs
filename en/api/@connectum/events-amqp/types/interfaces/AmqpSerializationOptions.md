[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpSerializationOptions

# Interface: AmqpSerializationOptions

Defined in: [packages/events-amqp/src/types.ts:181](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L181)

Serialization metadata and optional wire transcoding.

## Properties

### contentType?

> `readonly` `optional` **contentType?**: `string`

Defined in: [packages/events-amqp/src/types.ts:187](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L187)

AMQP `contentType` message property.

#### Default

```ts
"application/protobuf"
```

***

### decode?

> `readonly` `optional` **decode?**: (`content`) => `Uint8Array`

Defined in: [packages/events-amqp/src/types.ts:200](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L200)

Transform the incoming wire body before it reaches the event handler.
Failures nack the message (requeue per consumer policy).

#### Parameters

##### content

`Uint8Array`

#### Returns

`Uint8Array`

***

### encode?

> `readonly` `optional` **encode?**: (`payload`) => `Uint8Array`

Defined in: [packages/events-amqp/src/types.ts:194](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L194)

Transform the outgoing wire body. Receives the payload bytes the
EventBus (or the application) produced. Failures reject the publish
with `AmqpSerializationError`.

#### Parameters

##### payload

`Uint8Array`

#### Returns

`Uint8Array`

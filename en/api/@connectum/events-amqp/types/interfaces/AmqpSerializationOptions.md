[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpSerializationOptions

# Interface: AmqpSerializationOptions

Defined in: [packages/events-amqp/src/types.ts:349](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L349)

Serialization metadata and optional wire transcoding.

## Properties

### contentType?

> `readonly` `optional` **contentType?**: `string`

Defined in: [packages/events-amqp/src/types.ts:355](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L355)

AMQP `contentType` message property.

#### Default

```ts
"application/protobuf"
```

***

### decode?

> `readonly` `optional` **decode?**: (`content`) => `Uint8Array`

Defined in: [packages/events-amqp/src/types.ts:371](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L371)

Transform the incoming wire body before it reaches the event handler.
A failure rejects the message without requeue (`basic.nack` with
`requeue: false`): the broker drops it, or dead-letters it when the
queue has a dead-letter exchange. Nothing is thrown or reported, and the
handler never sees the message.

#### Parameters

##### content

`Uint8Array`

#### Returns

`Uint8Array`

***

### encode?

> `readonly` `optional` **encode?**: (`payload`) => `Uint8Array`

Defined in: [packages/events-amqp/src/types.ts:362](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L362)

Transform the outgoing wire body. Receives the payload bytes the
EventBus (or the application) produced. Failures reject the publish
with `AmqpSerializationError`.

#### Parameters

##### payload

`Uint8Array`

#### Returns

`Uint8Array`

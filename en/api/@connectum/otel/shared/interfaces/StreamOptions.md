[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / StreamOptions

# Interface: StreamOptions

Defined in: [shared.ts:82](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/shared.ts#L82)

Options of [wrapAsyncIterable](../functions/wrapAsyncIterable.md) beyond the span and the direction.

## Properties

### onEnd?

> `optional` **onEnd?**: (`outcome`) => `void`

Defined in: [shared.ts:92](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/shared.ts#L92)

Called once when a stream that ends its span ends: after the last message, after an
error, or when the consumer stops reading. It runs before the span ends, so it can
still put attributes on the span, and it takes over the recording of a failure
(without it the failure is recorded on the span as is). An exception it throws is
swallowed: telemetry must not change what the consumer of the stream receives.

#### Parameters

##### outcome

[`StreamOutcome`](../type-aliases/StreamOutcome.md)

#### Returns

`void`

***

### schema?

> `optional` **schema?**: [`DescMessage`](https://protobufes.com/reference/reflection/descriptors/#types)

Defined in: [shared.ts:84](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/shared.ts#L84)

Descriptor of the stream's message type; event sizes are the serialized length under it.

[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / estimateMessageSize

# Function: estimateMessageSize()

> **estimateMessageSize**(`message`, `schema?`): `number`

Defined in: [shared.ts:58](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/shared.ts#L58)

Estimates the serialized size of a protobuf message in bytes.

With the message's `schema` (for a call, `method.input` or `method.output`), the size
is the byte length of `toBinary(schema, message)` from `@bufbuild/protobuf`: a
protobuf-es v2 message is a plain object and has no `toBinary()` method of its own.
Without a schema, or when the message cannot be serialized with it, a message that
exposes a `toBinary()` method (the protobuf-es v1 API) is measured with that method.
Otherwise the result is 0, and so it is for a message that fails to serialize: the
estimate must never fail the observed call.
The size is not remembered per message object: a message is mutable and an application
may reuse one object across calls, so every estimate measures the message as it is.

## Parameters

### message

`unknown`

The message to estimate size for

### schema?

[`DescMessage`](https://protobufes.com/reference/reflection/descriptors/#types)

The descriptor of the message type, when known

## Returns

`number`

Size in bytes, or 0 if size cannot be determined

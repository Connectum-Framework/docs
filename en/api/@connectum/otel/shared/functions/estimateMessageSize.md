[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / estimateMessageSize

# Function: estimateMessageSize()

> **estimateMessageSize**(`message`): `number`

Defined in: [packages/otel/src/shared.ts:49](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/otel/src/shared.ts#L49)

Estimates the serialized size of a protobuf message in bytes.

If the message exposes a `toBinary()` method (standard for protobuf-es messages),
returns the byte length of the serialized form. Otherwise returns 0.
Results are cached per message object using a WeakMap.

## Parameters

### message

`unknown`

The message to estimate size for

## Returns

`number`

Size in bytes, or 0 if size cannot be determined

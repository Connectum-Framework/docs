[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [types](../index.md) / MockDescMethodOptions

# Interface: MockDescMethodOptions

Defined in: [types.ts:111](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L111)

Options for [createMockDescMethod](../../index/functions/createMockDescMethod.md).

## Properties

### input?

> `optional` **input?**: [`DescMessage`](https://protobufes.com/reference/reflection/descriptors/#types)

Defined in: [types.ts:113](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L113)

Input message descriptor.

***

### kind?

> `optional` **kind?**: `"client_streaming"` \| `"server_streaming"` \| `"bidi_streaming"` \| `"unary"`

Defined in: [types.ts:117](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L117)

Method kind. Default: `'unary'`

***

### output?

> `optional` **output?**: [`DescMessage`](https://protobufes.com/reference/reflection/descriptors/#types)

Defined in: [types.ts:115](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L115)

Output message descriptor.

***

### ~~useSensitiveRedaction?~~

> `optional` **useSensitiveRedaction?**: `boolean`

Defined in: [types.ts:126](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L126)

Put the fixture-only marker `{ debug_redact: true }` into `proto.options`. Default: `false`

#### Deprecated

`google.protobuf.MethodOptions` has no `debug_redact` field: the marker
  exists only in this fixture, nothing in Connectum reads it, and it does not conform
  to a compiled descriptor. It keeps its behaviour for existing tests. Mark a field
  with `isSensitive` instead.

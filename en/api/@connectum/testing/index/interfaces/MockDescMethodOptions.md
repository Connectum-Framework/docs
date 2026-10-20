[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / MockDescMethodOptions

# Interface: MockDescMethodOptions

Defined in: test-fixtures/dist/types.d.ts:64

Options for [createMockDescMethod](../functions/createMockDescMethod.md).

## Properties

### input?

> `optional` **input?**: [`DescMessage`](https://protobufes.com/reference/reflection/descriptors/#types)

Defined in: test-fixtures/dist/types.d.ts:66

Input message descriptor.

***

### kind?

> `optional` **kind?**: `"client_streaming"` \| `"server_streaming"` \| `"bidi_streaming"` \| `"unary"`

Defined in: test-fixtures/dist/types.d.ts:70

Method kind. Default: `'unary'`

***

### output?

> `optional` **output?**: [`DescMessage`](https://protobufes.com/reference/reflection/descriptors/#types)

Defined in: test-fixtures/dist/types.d.ts:68

Output message descriptor.

***

### ~~useSensitiveRedaction?~~

> `optional` **useSensitiveRedaction?**: `boolean`

Defined in: test-fixtures/dist/types.d.ts:79

Put the fixture-only marker `{ debug_redact: true }` into `proto.options`. Default: `false`

#### Deprecated

`google.protobuf.MethodOptions` has no `debug_redact` field: the marker
  exists only in this fixture, nothing in Connectum reads it, and it does not conform
  to a compiled descriptor. It keeps its behaviour for existing tests. Mark a field
  with `isSensitive` instead.

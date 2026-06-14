[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / MockDescMethodOptions

# Interface: MockDescMethodOptions

Defined in: test-fixtures/dist/types.d.ts:52

Options for [createMockDescMethod](../functions/createMockDescMethod.md).

## Properties

### input?

> `optional` **input?**: `DescMessage`

Defined in: test-fixtures/dist/types.d.ts:54

Input message descriptor.

***

### kind?

> `optional` **kind?**: `"unary"` \| `"client_streaming"` \| `"server_streaming"` \| `"bidi_streaming"`

Defined in: test-fixtures/dist/types.d.ts:58

Method kind. Default: `'unary'`

***

### output?

> `optional` **output?**: `DescMessage`

Defined in: test-fixtures/dist/types.d.ts:56

Output message descriptor.

***

### useSensitiveRedaction?

> `optional` **useSensitiveRedaction?**: `boolean`

Defined in: test-fixtures/dist/types.d.ts:60

Enable sensitive field redaction for this method. Default: `false`

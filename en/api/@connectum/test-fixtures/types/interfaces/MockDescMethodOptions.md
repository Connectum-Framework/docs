[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [types](../index.md) / MockDescMethodOptions

# Interface: MockDescMethodOptions

Defined in: types.ts:68

Options for createMockDescMethod.

## Properties

### input?

> `optional` **input?**: `DescMessage`

Defined in: types.ts:70

Input message descriptor.

***

### kind?

> `optional` **kind?**: `"unary"` \| `"client_streaming"` \| `"server_streaming"` \| `"bidi_streaming"`

Defined in: types.ts:74

Method kind. Default: `'unary'`

***

### output?

> `optional` **output?**: `DescMessage`

Defined in: types.ts:72

Output message descriptor.

***

### useSensitiveRedaction?

> `optional` **useSensitiveRedaction?**: `boolean`

Defined in: types.ts:76

Enable sensitive field redaction for this method. Default: `false`

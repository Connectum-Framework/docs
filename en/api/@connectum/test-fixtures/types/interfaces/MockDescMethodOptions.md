[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [types](../index.md) / MockDescMethodOptions

# Interface: MockDescMethodOptions

Defined in: [types.ts:72](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L72)

Options for [createMockDescMethod](../../index/functions/createMockDescMethod.md).

## Properties

### input?

> `optional` **input?**: [`DescMessage`](https://protobufes.com/reference/reflection/descriptors/#types)

Defined in: [types.ts:74](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L74)

Input message descriptor.

***

### kind?

> `optional` **kind?**: `"unary"` \| `"client_streaming"` \| `"server_streaming"` \| `"bidi_streaming"`

Defined in: [types.ts:78](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L78)

Method kind. Default: `'unary'`

***

### output?

> `optional` **output?**: [`DescMessage`](https://protobufes.com/reference/reflection/descriptors/#types)

Defined in: [types.ts:76](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L76)

Output message descriptor.

***

### useSensitiveRedaction?

> `optional` **useSensitiveRedaction?**: `boolean`

Defined in: [types.ts:80](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L80)

Enable sensitive field redaction for this method. Default: `false`

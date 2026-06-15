[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [types](../index.md) / MockDescMethodOptions

# Interface: MockDescMethodOptions

Defined in: [types.ts:68](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/test-fixtures/src/types.ts#L68)

Options for createMockDescMethod.

## Properties

### input?

> `optional` **input?**: `DescMessage`

Defined in: [types.ts:70](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/test-fixtures/src/types.ts#L70)

Input message descriptor.

***

### kind?

> `optional` **kind?**: `"unary"` \| `"client_streaming"` \| `"server_streaming"` \| `"bidi_streaming"`

Defined in: [types.ts:74](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/test-fixtures/src/types.ts#L74)

Method kind. Default: `'unary'`

***

### output?

> `optional` **output?**: `DescMessage`

Defined in: [types.ts:72](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/test-fixtures/src/types.ts#L72)

Output message descriptor.

***

### useSensitiveRedaction?

> `optional` **useSensitiveRedaction?**: `boolean`

Defined in: [types.ts:76](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/test-fixtures/src/types.ts#L76)

Enable sensitive field redaction for this method. Default: `false`

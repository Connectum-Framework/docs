[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [types](../index.md) / FakeMethodOptions

# Interface: FakeMethodOptions

Defined in: [types.ts:125](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L125)

Options for [createFakeMethod](../../index/functions/createFakeMethod.md).

## Properties

### methodKind?

> `optional` **methodKind?**: `"client_streaming"` \| `"server_streaming"` \| `"bidi_streaming"` \| `"unary"`

Defined in: [types.ts:127](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L127)

Method kind. Default: `'unary'`

***

### register?

> `optional` **register?**: `boolean`

Defined in: [types.ts:129](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L129)

Whether to register the method in service.methods. Default: `false`

[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [types](../index.md) / FakeMethodOptions

# Interface: FakeMethodOptions

Defined in: [types.ts:106](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L106)

Options for [createFakeMethod](../../index/functions/createFakeMethod.md).

## Properties

### methodKind?

> `optional` **methodKind?**: `"unary"` \| `"client_streaming"` \| `"server_streaming"` \| `"bidi_streaming"`

Defined in: [types.ts:108](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L108)

Method kind. Default: `'unary'`

***

### register?

> `optional` **register?**: `boolean`

Defined in: [types.ts:110](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L110)

Whether to register the method in service.methods. Default: `false`

[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [types](../index.md) / FakeMethodOptions

# Interface: FakeMethodOptions

Defined in: types.ts:102

Options for createFakeMethod.

## Properties

### methodKind?

> `optional` **methodKind?**: `"unary"` \| `"client_streaming"` \| `"server_streaming"` \| `"bidi_streaming"`

Defined in: types.ts:104

Method kind. Default: `'unary'`

***

### register?

> `optional` **register?**: `boolean`

Defined in: types.ts:106

Whether to register the method in service.methods. Default: `false`

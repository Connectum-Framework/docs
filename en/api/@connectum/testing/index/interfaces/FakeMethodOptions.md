[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / FakeMethodOptions

# Interface: FakeMethodOptions

Defined in: test-fixtures/dist/types.d.ts:94

Options for [createFakeMethod](../functions/createFakeMethod.md).

## Properties

### methodKind?

> `optional` **methodKind?**: `"client_streaming"` \| `"server_streaming"` \| `"bidi_streaming"` \| `"unary"`

Defined in: test-fixtures/dist/types.d.ts:96

Method kind. Default: `'unary'`

***

### register?

> `optional` **register?**: `boolean`

Defined in: test-fixtures/dist/types.d.ts:98

Whether to register the method in service.methods. Default: `false`

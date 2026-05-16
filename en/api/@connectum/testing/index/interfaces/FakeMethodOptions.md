[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / FakeMethodOptions

# Interface: FakeMethodOptions

Defined in: test-fixtures/dist/types.d.ts:75

Options for [createFakeMethod](../functions/createFakeMethod.md).

## Properties

### methodKind?

> `optional` **methodKind?**: `"unary"` \| `"client_streaming"` \| `"server_streaming"` \| `"bidi_streaming"`

Defined in: test-fixtures/dist/types.d.ts:77

Method kind. Default: `'unary'`

***

### register?

> `optional` **register?**: `boolean`

Defined in: test-fixtures/dist/types.d.ts:79

Whether to register the method in service.methods. Default: `false`

[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [types](../index.md) / FakeMethodOptions

# Interface: FakeMethodOptions

Defined in: [types.ts:156](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L156)

Options for [createFakeMethod](../../index/functions/createFakeMethod.md).

## Properties

### methodKind?

> `optional` **methodKind?**: `"client_streaming"` \| `"server_streaming"` \| `"bidi_streaming"` \| `"unary"`

Defined in: [types.ts:158](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L158)

Method kind. Default: `'unary'`

***

### register?

> `optional` **register?**: `boolean`

Defined in: [types.ts:163](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L163)

Whether to register the method in service.methods. Default: `false`
Registering a name that the service already has throws.

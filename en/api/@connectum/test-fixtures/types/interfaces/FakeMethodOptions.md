[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [types](../index.md) / FakeMethodOptions

# Interface: FakeMethodOptions

Defined in: [types.ts:102](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/test-fixtures/src/types.ts#L102)

Options for createFakeMethod.

## Properties

### methodKind?

> `optional` **methodKind?**: `"unary"` \| `"client_streaming"` \| `"server_streaming"` \| `"bidi_streaming"`

Defined in: [types.ts:104](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/test-fixtures/src/types.ts#L104)

Method kind. Default: `'unary'`

***

### register?

> `optional` **register?**: `boolean`

Defined in: [types.ts:106](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/test-fixtures/src/types.ts#L106)

Whether to register the method in service.methods. Default: `false`

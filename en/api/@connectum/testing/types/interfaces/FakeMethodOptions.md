[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [types](../index.md) / FakeMethodOptions

# Interface: FakeMethodOptions

Defined in: [types.ts:102](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/testing/src/types.ts#L102)

Options for createFakeMethod.

## Properties

### methodKind?

> `optional` **methodKind**: `"unary"` \| `"client_streaming"` \| `"server_streaming"` \| `"bidi_streaming"`

Defined in: [types.ts:104](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/testing/src/types.ts#L104)

Method kind. Default: `'unary'`

***

### register?

> `optional` **register**: `boolean`

Defined in: [types.ts:106](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/testing/src/types.ts#L106)

Whether to register the method in service.methods. Default: `false`

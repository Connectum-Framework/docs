[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [types](../index.md) / MockRequestOptions

# Interface: MockRequestOptions

Defined in: [types.ts:14](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/testing/src/types.ts#L14)

Options for createMockRequest.

## Properties

### headers?

> `optional` **headers**: `Headers`

Defined in: [types.ts:26](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/testing/src/types.ts#L26)

Request headers. Default: `new Headers()`

***

### message?

> `optional` **message**: `unknown`

Defined in: [types.ts:20](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/testing/src/types.ts#L20)

Request message payload. Default: `{}`

***

### method?

> `optional` **method**: `string`

Defined in: [types.ts:18](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/testing/src/types.ts#L18)

Method name. Default: `'TestMethod'`

***

### service?

> `optional` **service**: `string`

Defined in: [types.ts:16](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/testing/src/types.ts#L16)

Service type name. Default: `'test.TestService'`

***

### stream?

> `optional` **stream**: `boolean`

Defined in: [types.ts:22](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/testing/src/types.ts#L22)

Streaming request flag. Default: `false`

***

### url?

> `optional` **url**: `string`

Defined in: [types.ts:24](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/testing/src/types.ts#L24)

Request URL. Auto-generated from service/method if omitted.

[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [types](../index.md) / MockRequestOptions

# Interface: MockRequestOptions

Defined in: types.ts:14

Options for createMockRequest.

## Properties

### headers?

> `optional` **headers?**: `Headers`

Defined in: types.ts:26

Request headers. Default: `new Headers()`

***

### message?

> `optional` **message?**: `unknown`

Defined in: types.ts:20

Request message payload. Default: `{}`

***

### method?

> `optional` **method?**: `string`

Defined in: types.ts:18

Method name. Default: `'TestMethod'`

***

### service?

> `optional` **service?**: `string`

Defined in: types.ts:16

Service type name. Default: `'test.TestService'`

***

### stream?

> `optional` **stream?**: `boolean`

Defined in: types.ts:22

Streaming request flag. Default: `false`

***

### url?

> `optional` **url?**: `string`

Defined in: types.ts:24

Request URL. Auto-generated from service/method if omitted.

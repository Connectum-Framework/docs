[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / MockRequestOptions

# Interface: MockRequestOptions

Defined in: test-fixtures/dist/types.d.ts:10

Options for [createMockRequest](../functions/createMockRequest.md).

## Properties

### headers?

> `optional` **headers?**: `Headers`

Defined in: test-fixtures/dist/types.d.ts:22

Request headers. Default: `new Headers()`

***

### message?

> `optional` **message?**: `unknown`

Defined in: test-fixtures/dist/types.d.ts:16

Request message payload. Default: `{}`

***

### method?

> `optional` **method?**: `string`

Defined in: test-fixtures/dist/types.d.ts:14

Method name. Default: `'TestMethod'`

***

### service?

> `optional` **service?**: `string`

Defined in: test-fixtures/dist/types.d.ts:12

Service type name. Default: `'test.TestService'`

***

### stream?

> `optional` **stream?**: `boolean`

Defined in: test-fixtures/dist/types.d.ts:18

Streaming request flag. Default: `false`

***

### url?

> `optional` **url?**: `string`

Defined in: test-fixtures/dist/types.d.ts:20

Request URL. Auto-generated from service/method if omitted.

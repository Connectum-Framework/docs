[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / HttpHandler

# Type Alias: HttpHandler()

> **HttpHandler** = (`req`, `res`) => `boolean`

Defined in: [packages/core/src/types.ts:61](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/core/src/types.ts#L61)

HTTP handler for protocol-specific endpoints

## Parameters

### req

[`NodeRequest`](NodeRequest.md)

### res

[`NodeResponse`](NodeResponse.md)

## Returns

`boolean`

true if the request was handled, false otherwise

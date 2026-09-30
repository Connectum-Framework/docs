[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / HttpHandler

# Type Alias: HttpHandler

> **HttpHandler** = (`req`, `res`) => `boolean`

Defined in: [packages/core/src/types.ts:67](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/types.ts#L67)

HTTP handler for protocol-specific endpoints

## Parameters

### req

[`NodeRequest`](NodeRequest.md)

### res

[`NodeResponse`](NodeResponse.md)

## Returns

`boolean`

true if the request was handled, false otherwise

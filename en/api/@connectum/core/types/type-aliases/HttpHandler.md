[Connectum API Reference](../../../../index.md) / [@connectum/core](../../index.md) / [types](../index.md) / HttpHandler

# Type Alias: HttpHandler()

> **HttpHandler** = (`req`, `res`) => `boolean`

Defined in: [packages/core/src/types.ts:61](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/core/src/types.ts#L61)

HTTP handler for protocol-specific endpoints

## Parameters

### req

[`NodeRequest`](NodeRequest.md)

### res

[`NodeResponse`](NodeResponse.md)

## Returns

`boolean`

true if the request was handled, false otherwise

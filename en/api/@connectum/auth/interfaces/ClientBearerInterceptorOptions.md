[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / ClientBearerInterceptorOptions

# Interface: ClientBearerInterceptorOptions

Defined in: [packages/auth/src/types.ts:538](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L538)

Client-side Bearer token interceptor options.

## See

[createClientBearerInterceptor](../functions/createClientBearerInterceptor.md)

## Properties

### token

> `readonly` **token**: `string` \| (() => `Promise`\<`string`\>)

Defined in: [packages/auth/src/types.ts:546](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L546)

Bearer token value or async factory function.

When a string is provided, the same token is sent with every request.
When a function is provided, it is called before each request to
support token refresh flows.

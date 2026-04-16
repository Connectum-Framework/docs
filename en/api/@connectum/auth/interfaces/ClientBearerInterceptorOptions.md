[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / ClientBearerInterceptorOptions

# Interface: ClientBearerInterceptorOptions

Defined in: [packages/auth/src/types.ts:367](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/auth/src/types.ts#L367)

Client-side Bearer token interceptor options.

## See

[createClientBearerInterceptor](../functions/createClientBearerInterceptor.md)

## Properties

### token

> `readonly` **token**: `string` \| (() => `Promise`\<`string`\>)

Defined in: [packages/auth/src/types.ts:375](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/auth/src/types.ts#L375)

Bearer token value or async factory function.

When a string is provided, the same token is sent with every request.
When a function is provided, it is called before each request to
support token refresh flows.

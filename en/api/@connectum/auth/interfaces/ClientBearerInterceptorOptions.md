[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / ClientBearerInterceptorOptions

# Interface: ClientBearerInterceptorOptions

Defined in: [packages/auth/src/types.ts:683](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L683)

Client-side Bearer token interceptor options.

## See

[createClientBearerInterceptor](../functions/createClientBearerInterceptor.md)

## Properties

### token

> `readonly` **token**: `string` \| (() => `Promise`\<`string`\>)

Defined in: [packages/auth/src/types.ts:695](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L695)

Bearer token value or async factory function.

When a string is provided, the same token is sent with every request.
When a function is provided, it is called before each request to
support token refresh flows.

A static token must be a non-empty string (anything else throws when the interceptor is
created). A factory that resolves to anything but a non-empty string fails that call with
`Code.Unauthenticated` before a request is sent; the header is never `Bearer undefined`.

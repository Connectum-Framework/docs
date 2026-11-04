[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / ClientGatewayInterceptorOptions

# Interface: ClientGatewayInterceptorOptions

Defined in: [packages/auth/src/types.ts:703](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L703)

Client-side gateway service-to-service auth interceptor options.

## See

[createClientGatewayInterceptor](../functions/createClientGatewayInterceptor.md)

## Properties

### roles?

> `readonly` `optional` **roles?**: `string`[]

Defined in: [packages/auth/src/types.ts:721](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L721)

Optional roles to propagate (JSON-encoded in header). Creating the interceptor throws if this
is not an array of at most 8192 strings without holes whose JSON form fits the roles header
(measured as the header writer measures it, with every character above U+00FF written as six characters).
The roles are checked again on each call, so a change made after creation is refused with `InvalidArgument`.

***

### secret

> `readonly` **secret**: `string`

Defined in: [packages/auth/src/types.ts:709](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L709)

Shared secret for gateway trust verification. Creating the interceptor throws if it is empty,
contains NUL, CR, LF or a character above U+00FF, or starts or ends with a space or tab (the
platform removes that whitespace from a header value, so the secret would never match).

***

### subject

> `readonly` **subject**: `string`

Defined in: [packages/auth/src/types.ts:714](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L714)

Authenticated subject identifier (e.g., service name). Creating the interceptor throws if it
is empty, over 512 characters, or contains NUL, CR, LF or a lone surrogate (the header writer decides).

[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / ClientGatewayInterceptorOptions

# Interface: ClientGatewayInterceptorOptions

Defined in: [packages/auth/src/types.ts:383](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/auth/src/types.ts#L383)

Client-side gateway service-to-service auth interceptor options.

## See

[createClientGatewayInterceptor](../functions/createClientGatewayInterceptor.md)

## Properties

### roles?

> `readonly` `optional` **roles?**: `string`[]

Defined in: [packages/auth/src/types.ts:389](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/auth/src/types.ts#L389)

Optional roles to propagate (JSON-encoded in header)

***

### secret

> `readonly` **secret**: `string`

Defined in: [packages/auth/src/types.ts:385](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/auth/src/types.ts#L385)

Shared secret for gateway trust verification

***

### subject

> `readonly` **subject**: `string`

Defined in: [packages/auth/src/types.ts:387](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/auth/src/types.ts#L387)

Authenticated subject identifier (e.g., service name)

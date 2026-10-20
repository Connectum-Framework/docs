[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / ClientGatewayInterceptorOptions

# Interface: ClientGatewayInterceptorOptions

Defined in: [packages/auth/src/types.ts:595](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L595)

Client-side gateway service-to-service auth interceptor options.

## See

[createClientGatewayInterceptor](../functions/createClientGatewayInterceptor.md)

## Properties

### roles?

> `readonly` `optional` **roles?**: `string`[]

Defined in: [packages/auth/src/types.ts:601](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L601)

Optional roles to propagate (JSON-encoded in header)

***

### secret

> `readonly` **secret**: `string`

Defined in: [packages/auth/src/types.ts:597](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L597)

Shared secret for gateway trust verification

***

### subject

> `readonly` **subject**: `string`

Defined in: [packages/auth/src/types.ts:599](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L599)

Authenticated subject identifier (e.g., service name)

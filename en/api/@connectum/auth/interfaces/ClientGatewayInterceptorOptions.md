[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / ClientGatewayInterceptorOptions

# Interface: ClientGatewayInterceptorOptions

Defined in: [packages/auth/src/types.ts:554](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L554)

Client-side gateway service-to-service auth interceptor options.

## See

[createClientGatewayInterceptor](../functions/createClientGatewayInterceptor.md)

## Properties

### roles?

> `readonly` `optional` **roles?**: `string`[]

Defined in: [packages/auth/src/types.ts:560](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L560)

Optional roles to propagate (JSON-encoded in header)

***

### secret

> `readonly` **secret**: `string`

Defined in: [packages/auth/src/types.ts:556](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L556)

Shared secret for gateway trust verification

***

### subject

> `readonly` **subject**: `string`

Defined in: [packages/auth/src/types.ts:558](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L558)

Authenticated subject identifier (e.g., service name)

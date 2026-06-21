[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / ClientGatewayInterceptorOptions

# Interface: ClientGatewayInterceptorOptions

Defined in: [packages/auth/src/types.ts:540](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L540)

Client-side gateway service-to-service auth interceptor options.

## See

[createClientGatewayInterceptor](../functions/createClientGatewayInterceptor.md)

## Properties

### roles?

> `readonly` `optional` **roles?**: `string`[]

Defined in: [packages/auth/src/types.ts:546](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L546)

Optional roles to propagate (JSON-encoded in header)

***

### secret

> `readonly` **secret**: `string`

Defined in: [packages/auth/src/types.ts:542](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L542)

Shared secret for gateway trust verification

***

### subject

> `readonly` **subject**: `string`

Defined in: [packages/auth/src/types.ts:544](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L544)

Authenticated subject identifier (e.g., service name)

[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / GatewayAuthInterceptorOptions

# Interface: GatewayAuthInterceptorOptions

Defined in: [packages/auth/src/types.ts:309](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L309)

Gateway auth interceptor options.

For services behind an API gateway that has already performed authentication.
Extracts auth context from gateway-injected headers.

## Properties

### defaultType?

> `readonly` `optional` **defaultType?**: `string`

Defined in: [packages/auth/src/types.ts:326](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L326)

Default credential type when not provided by gateway

***

### headerMapping

> `readonly` **headerMapping**: [`GatewayHeaderMapping`](GatewayHeaderMapping.md)

Defined in: [packages/auth/src/types.ts:311](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L311)

Mapping from AuthContext fields to gateway header names

***

### propagateHeaders?

> `readonly` `optional` **propagateHeaders?**: `boolean`

Defined in: [packages/auth/src/types.ts:324](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L324)

Propagate auth context as headers for downstream services

***

### skipMethods?

> `readonly` `optional` **skipMethods?**: `string`[]

Defined in: [packages/auth/src/types.ts:322](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L322)

Methods to skip authentication for

***

### stripHeaders?

> `readonly` `optional` **stripHeaders?**: `string`[]

Defined in: [packages/auth/src/types.ts:320](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L320)

Headers to strip from the request after extraction (prevent spoofing)

***

### trustSource

> `readonly` **trustSource**: `object`

Defined in: [packages/auth/src/types.ts:313](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L313)

Trust verification: check that request came from a trusted gateway

#### expectedValues

> `readonly` **expectedValues**: `string`[]

Accepted values for the trust header

#### header

> `readonly` **header**: `string`

Header set by the gateway to prove trust

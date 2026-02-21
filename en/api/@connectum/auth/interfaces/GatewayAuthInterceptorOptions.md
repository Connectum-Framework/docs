[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / GatewayAuthInterceptorOptions

# Interface: GatewayAuthInterceptorOptions

Defined in: [packages/auth/src/types.ts:301](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L301)

Gateway auth interceptor options.

For services behind an API gateway that has already performed authentication.
Extracts auth context from gateway-injected headers.

## Properties

### defaultType?

> `readonly` `optional` **defaultType**: `string`

Defined in: [packages/auth/src/types.ts:318](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L318)

Default credential type when not provided by gateway

***

### headerMapping

> `readonly` **headerMapping**: [`GatewayHeaderMapping`](GatewayHeaderMapping.md)

Defined in: [packages/auth/src/types.ts:303](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L303)

Mapping from AuthContext fields to gateway header names

***

### propagateHeaders?

> `readonly` `optional` **propagateHeaders**: `boolean`

Defined in: [packages/auth/src/types.ts:316](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L316)

Propagate auth context as headers for downstream services

***

### skipMethods?

> `readonly` `optional` **skipMethods**: `string`[]

Defined in: [packages/auth/src/types.ts:314](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L314)

Methods to skip authentication for

***

### stripHeaders?

> `readonly` `optional` **stripHeaders**: `string`[]

Defined in: [packages/auth/src/types.ts:312](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L312)

Headers to strip from the request after extraction (prevent spoofing)

***

### trustSource

> `readonly` **trustSource**: `object`

Defined in: [packages/auth/src/types.ts:305](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L305)

Trust verification: check that request came from a trusted gateway

#### expectedValues

> `readonly` **expectedValues**: `string`[]

Accepted values for the trust header

#### header

> `readonly` **header**: `string`

Header set by the gateway to prove trust

[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / GatewayAuthInterceptorOptions

# Interface: GatewayAuthInterceptorOptions

Defined in: [packages/auth/src/types.ts:331](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L331)

Gateway auth interceptor options.

For services behind an API gateway that has already performed authentication.
Extracts auth context from gateway-injected headers.

## Properties

### defaultType?

> `readonly` `optional` **defaultType?**: `string`

Defined in: [packages/auth/src/types.ts:355](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L355)

Credential type used when the gateway sends no type header.
A value containing NUL, CR or LF throws when the interceptor is created.

#### Default

```ts
"gateway"
```

***

### headerMapping

> `readonly` **headerMapping**: [`GatewayHeaderMapping`](GatewayHeaderMapping.md)

Defined in: [packages/auth/src/types.ts:333](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L333)

Mapping from AuthContext fields to gateway header names

***

### propagateHeaders?

> `readonly` `optional` **propagateHeaders?**: `boolean`

Defined in: [packages/auth/src/types.ts:349](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L349)

Propagate auth context as headers for downstream services.
An identity containing NUL, CR or LF is rejected with `Unauthenticated` while this is on.

***

### skipMethods?

> `readonly` `optional` **skipMethods?**: `string`[]

Defined in: [packages/auth/src/types.ts:344](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L344)

Methods to skip authentication for. The catch-all `"*"` is refused (creation throws).

***

### stripHeaders?

> `readonly` `optional` **stripHeaders?**: `string`[]

Defined in: [packages/auth/src/types.ts:342](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L342)

Headers to strip from the request after extraction (prevent spoofing)

***

### trustSource

> `readonly` **trustSource**: `object`

Defined in: [packages/auth/src/types.ts:335](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L335)

Trust verification: check that request came from a trusted gateway

#### expectedValues

> `readonly` **expectedValues**: `string`[]

Accepted values for the trust header

#### header

> `readonly` **header**: `string`

Header set by the gateway to prove trust

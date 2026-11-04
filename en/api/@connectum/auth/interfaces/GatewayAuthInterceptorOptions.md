[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / GatewayAuthInterceptorOptions

# Interface: GatewayAuthInterceptorOptions

Defined in: [packages/auth/src/types.ts:405](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L405)

Gateway auth interceptor options.

For services behind an API gateway that has already performed authentication.
Extracts auth context from gateway-injected headers.

## Properties

### defaultType?

> `readonly` `optional` **defaultType?**: `string`

Defined in: [packages/auth/src/types.ts:448](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L448)

Credential type used when the gateway sends no type header.
A value containing NUL, CR or LF throws when the interceptor is created. With `propagateHeaders`
on, an empty value, a value longer than 128 characters and a value with a lone surrogate throw
too, because the value is written into `x-auth-type`; with it off they are accepted.

#### Default

```ts
"gateway"
```

***

### headerMapping

> `readonly` **headerMapping**: [`GatewayHeaderMapping`](GatewayHeaderMapping.md)

Defined in: [packages/auth/src/types.ts:407](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L407)

Mapping from AuthContext fields to gateway header names

***

### propagateHeaders?

> `readonly` `optional` **propagateHeaders?**: `boolean`

Defined in: [packages/auth/src/types.ts:440](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L440)

Propagate auth context as headers for downstream services.
An identity containing NUL, CR or LF is rejected with `Unauthenticated` while this is on. Text above U+00FF is written as `utf-8''` plus percent-encoded UTF-8 (with `x-auth-encoding: percent-utf8`) and read back by the receiver. An identity that does not fit its header (subject over 512 characters, type over 128, name over 256, serialized roles, scopes or claims over 8192) is rejected too, never cut or left out.

***

### skipMethods?

> `readonly` `optional` **skipMethods?**: `string`[]

Defined in: [packages/auth/src/types.ts:435](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L435)

Methods to skip authentication for. The catch-all `"*"` is refused (creation throws).

***

### stripHeaders?

> `readonly` `optional` **stripHeaders?**: `string`[]

Defined in: [packages/auth/src/types.ts:433](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L433)

Headers to strip from the request after extraction (prevent spoofing)

***

### trustSource

> `readonly` **trustSource**: `object`

Defined in: [packages/auth/src/types.ts:409](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L409)

Trust verification: check that request came from a trusted gateway

#### allowCallerControlledCidr?

> `readonly` `optional` **allowCallerControlledCidr?**: `boolean`

Allow IPv4 CIDR blocks in `expectedValues`. Off by default: with a CIDR block present and
this option unset, creating the interceptor throws.

A block is matched against the value of the trust header, and a caller that reaches the
service directly chooses that value itself, so `10.0.0.0/8` admits anyone who sends
`10.9.9.9`. Enable it only when a trusted upstream overwrites the header on every request
and no client can reach the service without passing through it. Trust based on the peer
address of the connection belongs in the mTLS or mesh-identity trust helpers.

##### Default

```ts
false
```

#### expectedValues

> `readonly` **expectedValues**: `string`[]

Accepted values for the trust header: shared secrets compared exactly, and, only with
`allowCallerControlledCidr`, IPv4 CIDR blocks such as `10.0.0.0/8`. Every entry must be
a non-empty string, so an unset environment variable (`[process.env.GATEWAY_SECRET]`
gives `[undefined]`) throws when the interceptor is created instead of failing every request.

#### header

> `readonly` **header**: `string`

Header set by the gateway to prove trust. A non-empty string; anything else throws when the interceptor is created.

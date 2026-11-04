[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / InternalAuthInterceptorOptions

# Interface: InternalAuthInterceptorOptions

Defined in: [packages/auth/src/types.ts:472](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L472)

Options for [createInternalAuthInterceptor](../functions/createInternalAuthInterceptor.md).

## Properties

### internalMethods

> `readonly` **internalMethods**: readonly `string`[]

Defined in: [packages/auth/src/types.ts:491](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L491)

Method patterns that are internal (service-to-service). Typically the
output of `getInternalMethods(services)`. The interceptor enforces the
trust marker only on these methods; all other methods pass through
unchanged (no-op).

Patterns: `"Service/Method"`, `"Service/*"`, or `"*"`. Any other pattern, a partial
wildcard included, throws when the interceptor is created.

***

### trustSource

> `readonly` **trustSource**: [`InternalTrustSource`](../type-aliases/InternalTrustSource.md)

Defined in: [packages/auth/src/types.ts:481](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L481)

The trust source that authorizes an internal call.

Use one of the provided factories — [meshIdentityTrust](../functions/meshIdentityTrust.md) (production
default, per-service via the mesh), [signedTokenTrust](../functions/signedTokenTrust.md) (non-mesh,
per-service JWT/JWKS with mandatory issuer-bound key selection), or
[sharedSecretTrust](../functions/sharedSecretTrust.md) (dev-only fallback) — or supply a custom one.

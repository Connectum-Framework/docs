[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / InternalAuthInterceptorOptions

# Interface: InternalAuthInterceptorOptions

Defined in: [packages/auth/src/types.ts:378](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L378)

Options for [createInternalAuthInterceptor](../functions/createInternalAuthInterceptor.md).

## Properties

### internalMethods

> `readonly` **internalMethods**: readonly `string`[]

Defined in: [packages/auth/src/types.ts:396](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L396)

Method patterns that are internal (service-to-service). Typically the
output of `getInternalMethods(services)`. The interceptor enforces the
trust marker only on these methods; all other methods pass through
unchanged (no-op).

Patterns: `"Service/Method"`, `"Service/*"`, or `"*"`.

***

### trustSource

> `readonly` **trustSource**: [`InternalTrustSource`](../type-aliases/InternalTrustSource.md)

Defined in: [packages/auth/src/types.ts:387](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L387)

The trust source that authorizes an internal call.

Use one of the provided factories — [meshIdentityTrust](../functions/meshIdentityTrust.md) (production
default, per-service via the mesh), [signedTokenTrust](../functions/signedTokenTrust.md) (non-mesh,
per-service JWT/JWKS with mandatory issuer-bound key selection), or
[sharedSecretTrust](../functions/sharedSecretTrust.md) (dev-only fallback) — or supply a custom one.

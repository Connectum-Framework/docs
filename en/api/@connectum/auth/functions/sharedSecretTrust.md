[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / sharedSecretTrust

# Function: sharedSecretTrust()

> **sharedSecretTrust**(`options`): [`InternalTrustSource`](../type-aliases/InternalTrustSource.md)

Defined in: [packages/auth/src/internal-auth-interceptor.ts:384](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/internal-auth-interceptor.ts#L384)

Trust source that constant-time compares a single shared secret (ADR-029
option (c)).

**DEV-ONLY.** A single shared secret is NOT per-service: every legitimate
caller holds the same secret, so one compromise forges ALL internal
identities. Use [meshIdentityTrust](meshIdentityTrust.md) (mesh) or [signedTokenTrust](signedTokenTrust.md)
(non-mesh per-service JWT) in production. This factory exists only for local
development and single-tenant low-trust-boundary setups, and is labeled as
such so it is never mistaken for a containment-providing mode.

## Parameters

### options

[`SharedSecretTrustOptions`](../interfaces/SharedSecretTrustOptions.md)

The shared secret, header name, and the granted identity.

## Returns

[`InternalTrustSource`](../type-aliases/InternalTrustSource.md)

An [InternalTrustSource](../type-aliases/InternalTrustSource.md).

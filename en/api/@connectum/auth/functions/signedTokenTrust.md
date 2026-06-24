[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / signedTokenTrust

# Function: signedTokenTrust()

> **signedTokenTrust**(`options`): [`InternalTrustSource`](../type-aliases/InternalTrustSource.md)

Defined in: [packages/auth/src/internal-auth-interceptor.ts:266](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/internal-auth-interceptor.ts#L266)

Trust source that verifies a per-service signed JWT via issuer-bound JWKS
(ADR-029 option (b) — non-mesh per-service containment, NOT a shared secret).

Each caller signs a short-lived JWT with its OWN private key; this trust
source verifies it against that service's published public key (JWKS).
Compromising service A's key forges only A.

**Hard security requirement — issuer-bound key selection (verified
empirically with `jose`).** The keyset is selected by the token's claimed
`iss` (`issuers[iss].jwksUri`), and `jose.jwtVerify` is pinned to that same
`issuer`. Each issuer gets its OWN `createRemoteJWKSet` — no `jwtVerify` call
ever receives a keyset containing more than one issuer's keys. A single shared
JWKS holding multiple services' keys does NOT contain compromise: `jose`
resolves the signing key by `kid` independently of the `iss` claim, so a token
claiming `iss: "B"` signed with A's key (header `kid: kid_A`) would be accepted
against a shared keyset. This per-issuer binding prevents that forge.

The framework ships only the verification primitive; key issuance/rotation/
JWKS publication belong to the deployment (SPIRE / the IdP / the mesh).

## Parameters

### options

[`SignedTokenTrustOptions`](../interfaces/SignedTokenTrustOptions.md)

Per-issuer JWKS configuration and the token header name.

## Returns

[`InternalTrustSource`](../type-aliases/InternalTrustSource.md)

An [InternalTrustSource](../type-aliases/InternalTrustSource.md).

[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / meshIdentityTrust

# Function: meshIdentityTrust()

> **meshIdentityTrust**(`options`): [`InternalTrustSource`](../type-aliases/InternalTrustSource.md)

Defined in: [packages/auth/src/internal-auth-interceptor.ts:144](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/internal-auth-interceptor.ts#L144)

Trust source that verifies a mesh-forwarded peer identity against an
allow-list (ADR-029 option (a) — production default, inherently per-service).

In a service mesh the sidecar terminates mTLS and forwards the verified peer
identity as a header (e.g. an Istio short-form ServiceAccount principal
`cluster.local/ns/<ns>/sa/<name>`, or a SPIFFE id). The mesh issues each
workload its OWN mTLS identity, so matching that forwarded principal against
an allow-list is per-service by construction — compromising one workload
cannot forge another's identity.

The identity header is stripped after extraction to prevent downstream
spoofing.

## Parameters

### options

[`MeshIdentityTrustOptions`](../interfaces/MeshIdentityTrustOptions.md)

Allow-list and the identity header name.

## Returns

[`InternalTrustSource`](../type-aliases/InternalTrustSource.md)

An [InternalTrustSource](../type-aliases/InternalTrustSource.md).

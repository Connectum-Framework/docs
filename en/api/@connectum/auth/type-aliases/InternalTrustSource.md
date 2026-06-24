[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / InternalTrustSource

# Type Alias: InternalTrustSource

> **InternalTrustSource** = (`req`) => [`AuthContext`](../interfaces/AuthContext.md) \| `null` \| `Promise`\<[`AuthContext`](../interfaces/AuthContext.md) \| `null`\>

Defined in: [packages/auth/src/types.ts:336](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L336)

A pluggable internal trust source (ADR-029).

Given the incoming request, returns an [AuthContext](../interfaces/AuthContext.md) for the calling
service when the internal trust marker is present and valid, or `null` when
it is missing/invalid. [createInternalAuthInterceptor](../functions/createInternalAuthInterceptor.md) converts `null`
(and any thrown error from the trust source) into `Code.Unauthenticated`.

The returned `AuthContext.subject` is the service identity; `roles`/`scopes`
come from the trust source (allow-list entry or verified token claims) so the
call composes with the existing `requires {roles,scopes}` authz model.

## Parameters

### req

The request (read-only access to headers).

#### header

`Headers`

## Returns

[`AuthContext`](../interfaces/AuthContext.md) \| `null` \| `Promise`\<[`AuthContext`](../interfaces/AuthContext.md) \| `null`\>

AuthContext for a trusted internal caller, or null to reject.

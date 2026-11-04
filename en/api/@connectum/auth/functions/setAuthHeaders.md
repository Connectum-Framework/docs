[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / setAuthHeaders

# Function: setAuthHeaders()

> **setAuthHeaders**(`headers`, `context`, `propagatedClaims?`): `void`

Defined in: [packages/auth/src/headers.ts:249](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/headers.ts#L249)

Serialize AuthContext to request headers.

Sets standard auth headers on the provided Headers object, all or none.
Used by auth interceptors when propagateHeaders is enabled.

`subject`, `type` and `name` have control characters removed (tab is kept); text above U+00FF is
written as `utf-8''` plus percent-encoded UTF-8, everything else is unchanged. Roles and claims
are JSON (characters above U+00FF are written as `\uXXXX` escapes, which the reader restores);
scopes are written as granted. Nothing is cut or left out: an identity that does not fit is
refused.

## Parameters

### headers

`Headers`

Headers object to set auth headers on

### context

[`AuthContext`](../interfaces/AuthContext.md)

Auth context to serialize

### propagatedClaims?

`string`[]

Optional list of claim keys to propagate (all if undefined)

## Returns

`void`

## Throws

(`UnsafeHeaderValueError`) When `subject`, `type`, `name` or a scope contains NUL, CR or LF or a lone surrogate,
  or a scope is empty or contains a space, or `roles` or `scopes` is not an array of at most 8192 strings without holes;
  the message names the field and no header has been set

## Throws

(`HeaderValueTooLargeError`) When `subject` is longer than 512 characters, `type` than 128, `name` than 256,
  or the serialized roles, scopes or claims than 8192; no header has been set

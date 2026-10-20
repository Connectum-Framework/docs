[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / setAuthHeaders

# Function: setAuthHeaders()

> **setAuthHeaders**(`headers`, `context`, `propagatedClaims?`): `void`

Defined in: [packages/auth/src/headers.ts:118](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/headers.ts#L118)

Serialize AuthContext to request headers.

Sets standard auth headers on the provided Headers object.
Used by auth interceptors when propagateHeaders is enabled.

`subject`, `type`, `name` are stripped of control characters (tab is kept) and truncated;
roles and claims are JSON (characters above U+00FF are written as `\uXXXX` escapes, which
the reader restores); scopes are written as granted. A `subject`, `type`, `name` or
scope containing NUL, CR, LF or a character above U+00FF is not sanitised but refused.

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

When `subject`, `type`, `name` or a scope contains NUL, CR, LF or a character above U+00FF; the message
  names the field and no header has been set

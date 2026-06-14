[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / setAuthHeaders

# Function: setAuthHeaders()

> **setAuthHeaders**(`headers`, `context`, `propagatedClaims?`): `void`

Defined in: [packages/auth/src/headers.ts:36](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/auth/src/headers.ts#L36)

Serialize AuthContext to request headers.

Sets standard auth headers on the provided Headers object.
Used by auth interceptors when propagateHeaders is enabled.

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

[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / setAuthHeaders

# Function: setAuthHeaders()

> **setAuthHeaders**(`headers`, `context`, `propagatedClaims?`): `void`

Defined in: [packages/auth/src/headers.ts:35](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/auth/src/headers.ts#L35)

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

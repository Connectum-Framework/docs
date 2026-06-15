[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / requireAuthContext

# Function: requireAuthContext()

> **requireAuthContext**(): [`AuthContext`](../interfaces/AuthContext.md)

Defined in: [packages/auth/src/context.ts:124](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/auth/src/context.ts#L124)

Get the current auth context or throw.

Like getAuthContext() but throws ConnectError(Code.Unauthenticated)
if no auth context is available. Use when auth is mandatory.

## Returns

[`AuthContext`](../interfaces/AuthContext.md)

Current auth context (never undefined)

## Throws

ConnectError with Code.Unauthenticated if no context

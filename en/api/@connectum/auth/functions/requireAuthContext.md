[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / requireAuthContext

# Function: requireAuthContext()

> **requireAuthContext**(): [`AuthContext`](../interfaces/AuthContext.md)

Defined in: [packages/auth/src/context.ts:57](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/context.ts#L57)

Get the current auth context or throw.

Like getAuthContext() but throws ConnectError(Code.Unauthenticated)
if no auth context is available. Use when auth is mandatory.

## Returns

[`AuthContext`](../interfaces/AuthContext.md)

Current auth context (never undefined)

## Throws

ConnectError with Code.Unauthenticated if no context

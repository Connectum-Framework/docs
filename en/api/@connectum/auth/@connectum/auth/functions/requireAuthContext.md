[Connectum API Reference](../../../../../index.md) / [@connectum/auth](../../../index.md) / [@connectum/auth](../index.md) / requireAuthContext

# Function: requireAuthContext()

> **requireAuthContext**(): [`AuthContext`](../interfaces/AuthContext.md)

Defined in: [packages/auth/src/context.ts:57](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/context.ts#L57)

Get the current auth context or throw.

Like getAuthContext() but throws ConnectError(Code.Unauthenticated)
if no auth context is available. Use when auth is mandatory.

## Returns

[`AuthContext`](../interfaces/AuthContext.md)

Current auth context (never undefined)

## Throws

ConnectError with Code.Unauthenticated if no context

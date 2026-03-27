[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / authContextStorage

# Variable: authContextStorage

> `const` **authContextStorage**: `AsyncLocalStorage`\<[`AuthContext`](../interfaces/AuthContext.md)\>

Defined in: [packages/auth/src/context.ts:20](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/auth/src/context.ts#L20)

Module-level AsyncLocalStorage for auth context.

Set by auth interceptors, read by handlers via getAuthContext().
Automatically isolated per async context (request).

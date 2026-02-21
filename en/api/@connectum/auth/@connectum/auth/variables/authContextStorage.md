[Connectum API Reference](../../../../../index.md) / [@connectum/auth](../../../index.md) / [@connectum/auth](../index.md) / authContextStorage

# Variable: authContextStorage

> `const` **authContextStorage**: `AsyncLocalStorage`\<[`AuthContext`](../interfaces/AuthContext.md)\>

Defined in: [packages/auth/src/context.ts:20](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/context.ts#L20)

Module-level AsyncLocalStorage for auth context.

Set by auth interceptors, read by handlers via getAuthContext().
Automatically isolated per async context (request).

[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / authContextStorage

# Variable: authContextStorage

> `const` **authContextStorage**: `AsyncLocalStorage`\<[`AuthContext`](../interfaces/AuthContext.md)\>

Defined in: [packages/auth/src/context.ts:87](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/auth/src/context.ts#L87)

Process-wide AsyncLocalStorage for auth context.

Uses globalThis + Symbol.for() to guarantee singleton even when
the module is evaluated multiple times (e.g., mixed src/dist imports in dev).

Set by auth interceptors, read by handlers via getAuthContext().
Automatically isolated per async context (request).

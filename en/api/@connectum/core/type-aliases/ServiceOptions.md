[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ServiceOptions

# Type Alias: ServiceOptions

> **ServiceOptions** = `NonNullable`\<`Parameters`\<`ConnectRouter`\[`"service"`\]\>\[`2`\]\>

Defined in: [packages/core/src/defineService.ts:28](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/defineService.ts#L28)

Per-service handler options forwarded to ConnectRPC's `router.service()` —
e.g. per-service `interceptors` (applied to every method of this service) and
`jsonOptions`. Derived from the underlying `ConnectRouter.service` signature
so it always matches the installed `@connectrpc/connect`.

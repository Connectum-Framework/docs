[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / perServiceEnvResolver

# Function: perServiceEnvResolver()

> **perServiceEnvResolver**(`map`, `options?`): [`RemoteResolver`](../type-aliases/RemoteResolver.md)

Defined in: [packages/core/src/remoteResolver.ts:100](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/remoteResolver.ts#L100)

A resolver backed by per-service environment variables: `map` pairs each
`typeName` with the name of the env var holding its base URL. A service with
no mapping, or whose env var is unset/empty, resolves to `null`
(→ `Code.Unavailable`). Replaces hand-rolled env registries in boot code.

## Parameters

### map

`Readonly`\<`Record`\<`string`, `string`\>\>

### options?

[`PerServiceEnvResolverOptions`](../interfaces/PerServiceEnvResolverOptions.md)

## Returns

[`RemoteResolver`](../type-aliases/RemoteResolver.md)

## Example

```ts
`perServiceEnvResolver({ "orders.v1.OrdersService": "ORDERS_URL" })`
```

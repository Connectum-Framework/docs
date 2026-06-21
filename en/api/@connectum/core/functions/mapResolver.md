[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / mapResolver

# Function: mapResolver()

> **mapResolver**(`map`): [`RemoteResolver`](../type-aliases/RemoteResolver.md)

Defined in: [packages/core/src/remoteResolver.ts:54](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/remoteResolver.ts#L54)

A resolver backed by an explicit `{ [typeName]: Transport }` map. Unknown
typeNames resolve to `null` (→ `Code.Unavailable`).

## Parameters

### map

`Readonly`\<`Record`\<`string`, `Transport`\>\>

## Returns

[`RemoteResolver`](../type-aliases/RemoteResolver.md)

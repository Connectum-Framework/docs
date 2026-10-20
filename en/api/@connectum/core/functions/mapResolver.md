[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / mapResolver

# Function: mapResolver()

> **mapResolver**(`map`): [`RemoteResolver`](../type-aliases/RemoteResolver.md)

Defined in: [packages/core/src/remoteResolver.ts:59](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/remoteResolver.ts#L59)

A resolver backed by an explicit `{ [typeName]: Transport }` map, an exact
allow-list: only the keys the map owns resolve. Every other `typeName`
resolves to `null` (→ `Code.Unavailable`), including names that exist on
`Object.prototype` (`constructor`, `toString`, `hasOwnProperty`, `valueOf`,
`__proto__`). A key the map owns resolves even when its name is also an
`Object.prototype` member. The lookup stays live: entries added to the map
after the resolver was created are honoured.

## Parameters

### map

`Readonly`\<`Record`\<`string`, `Transport`\>\>

## Returns

[`RemoteResolver`](../type-aliases/RemoteResolver.md)

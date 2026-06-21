[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / CatalogCall

# Type Alias: CatalogCall

> **CatalogCall** = \<`K`\>(`method`, `request`, `options?`) => `Promise`\<[`ConnectumCallMap`](../interfaces/ConnectumCallMap.md)\[`K`\]\[`"response"`\]\>

Defined in: [packages/core/src/context.ts:113](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L113)

The typed **unary** catalog-call surface: `call(method, request, options?)`
keyed off [ConnectumCallMap](../interfaces/ConnectumCallMap.md). Shared by the handler [Context](../interfaces/Context.md) and
the standalone `CatalogClient` (`createCatalogClient`) so both expose an
identical, fully-typed `call`.

## Type Parameters

### K

`K` *extends* keyof [`ConnectumCallMap`](../interfaces/ConnectumCallMap.md)

A `"${typeName}/${Method}"` key of [ConnectumCallMap](../interfaces/ConnectumCallMap.md).

## Parameters

### method

`K`

### request

[`ConnectumCallMap`](../interfaces/ConnectumCallMap.md)\[`K`\]\[`"request"`\]

### options?

[`CallOptions`](CallOptions.md)

## Returns

`Promise`\<[`ConnectumCallMap`](../interfaces/ConnectumCallMap.md)\[`K`\]\[`"response"`\]\>

[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / CatalogStream

# Type Alias: CatalogStream

> **CatalogStream** = \<`K`\>(`method`) => [`StreamReturn`](StreamReturn.md)\<[`ConnectumStreamMap`](../interfaces/ConnectumStreamMap.md)\[`K`\]\>

Defined in: [packages/core/src/context.ts:122](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/context.ts#L122)

The typed **streaming** catalog-call surface: `stream(method)` returns a
kind-specific factory keyed off [ConnectumStreamMap](../interfaces/ConnectumStreamMap.md). Shared by the
handler [Context](../interfaces/Context.md) and the standalone `CatalogClient`.

## Type Parameters

### K

`K` *extends* keyof [`ConnectumStreamMap`](../interfaces/ConnectumStreamMap.md)

A `"${typeName}/${Method}"` key of [ConnectumStreamMap](../interfaces/ConnectumStreamMap.md).

## Parameters

### method

`K`

## Returns

[`StreamReturn`](StreamReturn.md)\<[`ConnectumStreamMap`](../interfaces/ConnectumStreamMap.md)\[`K`\]\>

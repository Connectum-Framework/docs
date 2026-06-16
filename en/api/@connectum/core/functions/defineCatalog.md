[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / defineCatalog

# Function: defineCatalog()

> **defineCatalog**\<`T`\>(`record`): `Readonly`\<`T`\>

Defined in: [packages/core/src/serviceCatalog.ts:61](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/src/serviceCatalog.ts#L61)

Build a [ServiceCatalog](../type-aliases/ServiceCatalog.md) from a literal record, preserving the literal
key type for downstream inference. Equivalent to writing the record inline,
but freezes the result and documents intent.

Throws [CatalogConfigError](../classes/CatalogConfigError.md) if any key does not equal its descriptor's
`typeName` — a mis-keyed entry would bypass the duplicate-`typeName` intent
and break resolution by canonical type name.

## Type Parameters

### T

`T` *extends* `Record`\<`string`, `DescService`\>

## Parameters

### record

`T`

## Returns

`Readonly`\<`T`\>

## Example

```ts
const catalog = defineCatalog({
  [OrdersService.typeName]: OrdersService,
  [InventoryService.typeName]: InventoryService,
});
```

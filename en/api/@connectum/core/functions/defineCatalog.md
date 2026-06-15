[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / defineCatalog

# Function: defineCatalog()

> **defineCatalog**\<`T`\>(`record`): `Readonly`\<`T`\>

Defined in: [packages/core/src/serviceCatalog.ts:57](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/serviceCatalog.ts#L57)

Build a [ServiceCatalog](../type-aliases/ServiceCatalog.md) from a literal record, preserving the literal
key type for downstream inference. Equivalent to writing the record inline,
but freezes the result and documents intent.

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

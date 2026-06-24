[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / mergeCatalogs

# Function: mergeCatalogs()

> **mergeCatalogs**(...`catalogs`): [`ServiceCatalog`](../type-aliases/ServiceCatalog.md)

Defined in: [packages/core/src/serviceCatalog.ts:79](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/serviceCatalog.ts#L79)

Merge several catalogs into one.

Throws [CatalogConfigError](../classes/CatalogConfigError.md) on a duplicate `typeName`, or on a key that
does not equal its descriptor's `typeName`. TypeScript cannot catch a duplicate
whose two descriptors have an identical shape (polyrepo finding F3), so this
runtime check is mandatory rather than optional — a silent collision would
route calls to the wrong service.

## Parameters

### catalogs

...readonly `Readonly`\<`Record`\<`string`, `DescService`\>\>[]

## Returns

[`ServiceCatalog`](../type-aliases/ServiceCatalog.md)

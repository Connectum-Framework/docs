[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / mergeCatalogs

# Function: mergeCatalogs()

> **mergeCatalogs**(...`catalogs`): [`ServiceCatalog`](../type-aliases/ServiceCatalog.md)

Defined in: [packages/core/src/serviceCatalog.ts:69](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/serviceCatalog.ts#L69)

Merge several catalogs into one.

Throws `Error` on a duplicate `typeName`. TypeScript cannot catch a duplicate
whose two descriptors have an identical shape (polyrepo finding F3), so this
runtime check is mandatory rather than optional — a silent collision would
route calls to the wrong service.

## Parameters

### catalogs

...readonly `Readonly`\<`Record`\<`string`, `DescService`\>\>[]

## Returns

[`ServiceCatalog`](../type-aliases/ServiceCatalog.md)

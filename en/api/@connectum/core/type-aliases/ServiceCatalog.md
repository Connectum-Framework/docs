[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ServiceCatalog

# Type Alias: ServiceCatalog

> **ServiceCatalog** = `Readonly`\<`Record`\<`string`, `DescService`\>\>

Defined in: [packages/core/src/serviceCatalog.ts:20](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/serviceCatalog.ts#L20)

A readonly registry mapping a proto service `typeName`
(e.g. `"orders.v1.OrdersService"`) to its `DescService` descriptor.

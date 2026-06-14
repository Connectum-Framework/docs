[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ServiceCatalog

# Type Alias: ServiceCatalog

> **ServiceCatalog** = `Readonly`\<`Record`\<`string`, `DescService`\>\>

Defined in: [packages/core/src/serviceCatalog.ts:20](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/serviceCatalog.ts#L20)

A readonly registry mapping a proto service `typeName`
(e.g. `"orders.v1.OrdersService"`) to its `DescService` descriptor.

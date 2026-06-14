[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createMockContext

# Function: createMockContext()

> **createMockContext**(`options`): `Context`

Defined in: [testing/src/mockContext.ts:68](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/testing/src/mockContext.ts#L68)

Create a Context whose `ctx.call` / `ctx.stream` resolve against the
given mocks. Pass it as the second argument to a handler under test.

## Parameters

### options

[`CreateMockContextOptions`](../interfaces/CreateMockContextOptions.md)

## Returns

`Context`

## Example

```ts
const ctx = createMockContext({
  catalog: defineCatalog({ [InventoryService.typeName]: InventoryService }),
  mocks: [mockService(InventoryService, { getStock: () => create(StockSchema, { units: 7 }) })],
});
const res = await orderHandler(create(CreateOrderSchema, { sku: "x" }), ctx);
```

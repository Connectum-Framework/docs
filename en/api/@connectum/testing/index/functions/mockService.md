[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / mockService

# Function: mockService()

> **mockService**\<`S`\>(`service`, `impl`): [`MockService`](../interfaces/MockService.md)

Defined in: [testing/src/mockResolver.ts:38](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/testing/src/mockResolver.ts#L38)

Type-safe constructor for a [MockService](../interfaces/MockService.md). Pairs a service descriptor
with handlers typed against it.

## Type Parameters

### S

`S` *extends* `DescService`

## Parameters

### service

`S`

### impl

`Partial`\<`ServiceImpl`\<`S`\>\>

## Returns

[`MockService`](../interfaces/MockService.md)

## Example

```ts
mockService(InventoryService, {
  getStock: () => create(StockSchema, { units: 7 }),
});
```

[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / mockService

# Function: mockService()

> **mockService**\<`S`\>(`service`, `impl`): [`MockService`](../interfaces/MockService.md)

Defined in: [testing/src/mockResolver.ts:37](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/mockResolver.ts#L37)

Type-safe constructor for a [MockService](../interfaces/MockService.md). Pairs a service descriptor
with handlers typed against it.

## Type Parameters

### S

`S` *extends* [`DescService`](https://protobufes.com/reference/reflection/descriptors/#types)

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

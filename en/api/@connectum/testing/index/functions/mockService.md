[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / mockService

# Function: mockService()

> **mockService**\<`S`\>(`service`, `impl`): [`MockService`](../interfaces/MockService.md)

Defined in: [testing/src/mockResolver.ts:44](https://github.com/Connectum-Framework/connectum/blob/main/packages/testing/src/mockResolver.ts#L44)

Type-safe constructor for a [MockService](../interfaces/MockService.md). Pairs a service descriptor
with handlers typed against it.

A handler that throws a `ConnectError` answers with exactly that error. Any
other exception (a typo in the mock, a rejected promise, a thrown string)
reaches the caller as a `ConnectError` with code `Internal`, the exception's
own message and the exception itself as `cause`, so a broken mock shows up
in the test output instead of as an anonymous "internal error".

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

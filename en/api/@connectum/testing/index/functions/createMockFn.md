[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createMockFn

# Function: createMockFn()

> **createMockFn**\<`F`\>(`impl`): [`MockFn`](../interfaces/MockFn.md)\<`F`\>

Defined in: [mock-compat.ts:52](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/testing/src/mock-compat.ts#L52)

Create a portable mock function that wraps `impl` and records every call.

## Type Parameters

### F

`F` *extends* (...`args`) => `any`

## Parameters

### impl

`F`

The underlying implementation to delegate to.

## Returns

[`MockFn`](../interfaces/MockFn.md)\<`F`\>

A spy-enabled wrapper whose `.mock` property exposes call metadata.

## Example

```ts
const add = createMockFn((a: number, b: number) => a + b);
add(1, 2);
add(3, 4);
add.mock.callCount(); // 2
add.mock.calls[0].arguments; // [1, 2]
```

[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createMockStream

# Function: createMockStream()

> **createMockStream**\<`T`\>(`items`, `options?`): `AsyncIterable`\<`T`\>

Defined in: test-fixtures/dist/index.d.ts:370

Create an AsyncIterable that yields `items` sequentially.

Useful for testing ConnectRPC server-streaming or client-streaming
interceptors and handlers without a real gRPC connection.

The returned iterable is **reusable** — each call to
`Symbol.asyncIterator` starts a fresh iteration over the same items.

## Type Parameters

### T

`T`

Type of items yielded by the stream.

## Parameters

### items

`T`[]

Array of items to yield in order.

### options?

[`MockStreamOptions`](../interfaces/MockStreamOptions.md)

Optional stream behavior configuration.

## Returns

`AsyncIterable`\<`T`\>

An async iterable that yields each item from `items`.

## Example

```ts
import { createMockStream } from "@connectum/testing";

const stream = createMockStream([1, 2, 3], { delayMs: 10 });

for await (const value of stream) {
  console.log(value); // 1, 2, 3
}
```

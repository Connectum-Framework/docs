[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createMockNext

# Function: createMockNext()

> **createMockNext**(`options?`): `any`

Defined in: [mock-next.ts:36](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/testing/src/mock-next.ts#L36)

Create a mock `next` handler that resolves with a successful response.

The returned function is a spy (via [createMockFn](createMockFn.md)), so callers can
inspect `next.mock.calls` and `next.mock.callCount()` after the test.

## Parameters

### options?

[`MockNextOptions`](../../types/interfaces/MockNextOptions.md)

Optional overrides for the response payload and stream flag.

## Returns

`any`

A spy-enabled async function matching the ConnectRPC `next` signature.

## Example

```ts
import { createMockNext } from "@connectum/testing";

const next = createMockNext({ message: { id: 1 } });
const res = await next({});
// res.message => { id: 1 }
// next.mock.callCount() => 1
```

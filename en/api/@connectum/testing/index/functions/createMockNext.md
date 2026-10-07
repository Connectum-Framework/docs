[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createMockNext

# Function: createMockNext()

> **createMockNext**(`options?`): `any`

Defined in: test-fixtures/dist/index.d.ts:270

Create a mock `next` handler that resolves with a successful response.

The returned function is a spy (via [createMockFn](createMockFn.md)), so callers can
inspect `next.mock.calls` and `next.mock.callCount()` after the test.

## Parameters

### options?

[`MockNextOptions`](../interfaces/MockNextOptions.md)

Optional overrides for the response payload and stream flag.

## Returns

`any`

a spy-enabled async function resolving to a partial response with
  `stream` and `message` fields. Use a real `next` response when the code
  under test reads response headers, trailers, or descriptors.

## Example

```ts
import { createMockNext } from "@connectum/testing";

const next = createMockNext({ message: { id: 1 } });
const res = await next({});
// res.message => { id: 1 }
// next.mock.callCount() => 1
```

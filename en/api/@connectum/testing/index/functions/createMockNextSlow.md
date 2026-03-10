[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createMockNextSlow

# Function: createMockNextSlow()

> **createMockNextSlow**(`delay`, `options?`): `any`

Defined in: [mock-next.ts:93](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/testing/src/mock-next.ts#L93)

Create a mock `next` handler that resolves after a configurable delay.

Useful for testing timeout interceptors and other time-sensitive logic.

## Parameters

### delay

`number`

Time to wait in milliseconds before resolving.

### options?

[`MockNextOptions`](../../types/interfaces/MockNextOptions.md)

Optional overrides for the response payload and stream flag.

## Returns

`any`

A spy-enabled async function that sleeps before returning a response.

## Example

```ts
import { createMockNextSlow } from "@connectum/testing";

const next = createMockNextSlow(500);
const res = await next({}); // resolves after ~500 ms
// res.message => { result: "success" }
```

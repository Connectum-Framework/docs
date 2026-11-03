[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [index](../index.md) / createMockNextSlow

# Function: createMockNextSlow()

> **createMockNextSlow**(`delay`, `options?`): `any`

Defined in: [mock-next.ts:211](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/mock-next.ts#L211)

Create a mock `next` handler that resolves after a configurable delay.

Useful for testing timeout interceptors and other time-sensitive logic.

## Parameters

### delay

`number`

Time to wait in milliseconds before resolving: a finite number from 0 to 2147483647.

### options?

[`MockNextOptions`](../../types/interfaces/MockNextOptions.md)

Optional overrides for the response payload and stream flag.

## Returns

`any`

A spy-enabled async function that sleeps before returning a response.

## Throws

TypeError when `delay` is not a number.

## Throws

RangeError when `delay` is negative, `NaN`, infinite or larger than 2147483647:
  the timer would turn it into 1 ms and the handler would not be slow.

## Example

```ts
import { createMockNextSlow } from "@connectum/testing";

const next = createMockNextSlow(500);
const res = await next({}); // resolves after ~500 ms
// res.message => { result: "success" }
```

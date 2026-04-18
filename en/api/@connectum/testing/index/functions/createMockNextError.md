[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / createMockNextError

# Function: createMockNextError()

> **createMockNextError**(`code`, `message?`): `any`

Defined in: [mock-next.ts:68](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/testing/src/mock-next.ts#L68)

Create a mock `next` handler that always throws a ConnectError.

Useful for testing how interceptors handle downstream failures.

## Parameters

### code

`Code`

The gRPC status code for the error.

### message?

`string`

Human-readable error message. Defaults to `"Mock error"`.

## Returns

`any`

A spy-enabled async function that throws on every call.

## Example

```ts
import { Code } from "@connectrpc/connect";
import { createMockNextError } from "@connectum/testing";

const next = createMockNextError(Code.NotFound, "user not found");
await next({}).catch((err) => {
  // err instanceof ConnectError => true
  // err.code => Code.NotFound
});
```

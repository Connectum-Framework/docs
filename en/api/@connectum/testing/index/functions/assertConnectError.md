[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / assertConnectError

# Function: assertConnectError()

> **assertConnectError**(`error`, `expectedCode`, `messagePattern?`): `asserts error is ConnectError`

Defined in: [assertions.ts:44](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/testing/src/assertions.ts#L44)

Assert that a thrown value is a ConnectError with the expected
gRPC status code and, optionally, a message matching a pattern.

This is a TypeScript
[assertion function](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates):
after a successful call the compiler narrows `error` to `ConnectError`.

**Note on message format**: ConnectError messages include a code prefix,
e.g. `[not_found] user not found`. The `messagePattern` is matched against
the full message string. Use a `RegExp` for flexible matching.

## Parameters

### error

`unknown`

The value to check (typically from a `catch` block).

### expectedCode

`Code`

Expected gRPC/Connect status code.

### messagePattern?

`string` \| `RegExp`

Optional substring or RegExp to match against
  `error.message`.

## Returns

`asserts error is ConnectError`

## Throws

When any of the checks fail.

## Example

```ts
import { Code, ConnectError } from "@connectrpc/connect";
import { assertConnectError } from "@connectum/testing";

try {
  await client.getUser({ id: "missing" });
} catch (err) {
  assertConnectError(err, Code.NotFound, "user not found");
  // err is now typed as ConnectError
  console.log(err.code); // Code.NotFound
}
```

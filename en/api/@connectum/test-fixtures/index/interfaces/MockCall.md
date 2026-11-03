[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [index](../index.md) / MockCall

# Interface: MockCall\<Args, Result\>

Defined in: [mock-compat.ts:19](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/mock-compat.ts#L19)

A single recorded invocation of a [MockFn](MockFn.md).

## Type Parameters

### Args

`Args` *extends* readonly `unknown`[] = readonly `unknown`[]

### Result

`Result` = `unknown`

## Properties

### arguments

> `readonly` **arguments**: `Args`

Defined in: [mock-compat.ts:21](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/mock-compat.ts#L21)

The arguments passed to the mock function.

***

### error

> `readonly` **error**: `unknown`

Defined in: [mock-compat.ts:29](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/mock-compat.ts#L29)

What the implementation threw; `undefined` when it returned.

***

### result

> `readonly` **result**: `Result` \| `undefined`

Defined in: [mock-compat.ts:27](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/mock-compat.ts#L27)

What the implementation returned; `undefined` when it threw. For an async
implementation this is the promise, and a rejection is not recorded as `error`
(the same as `node:test`).

***

### this

> `readonly` **this**: `unknown`

Defined in: [mock-compat.ts:31](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/mock-compat.ts#L31)

The `this` the mock function was called with.

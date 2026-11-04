[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / MockCall

# Interface: MockCall\<Args, Result\>

Defined in: test-fixtures/dist/index.d.ts:129

A single recorded invocation of a [MockFn](MockFn.md).

## Type Parameters

### Args

`Args` *extends* readonly `unknown`[] = readonly `unknown`[]

### Result

`Result` = `unknown`

## Properties

### arguments

> `readonly` **arguments**: `Args`

Defined in: test-fixtures/dist/index.d.ts:131

The arguments passed to the mock function.

***

### error

> `readonly` **error**: `unknown`

Defined in: test-fixtures/dist/index.d.ts:139

What the implementation threw; `undefined` when it returned.

***

### result

> `readonly` **result**: `Result` \| `undefined`

Defined in: test-fixtures/dist/index.d.ts:137

What the implementation returned; `undefined` when it threw. For an async
implementation this is the promise, and a rejection is not recorded as `error`
(the same as `node:test`).

***

### this

> `readonly` **this**: `unknown`

Defined in: test-fixtures/dist/index.d.ts:141

The `this` the mock function was called with.

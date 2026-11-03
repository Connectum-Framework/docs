[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [index](../index.md) / MockFn

# Interface: MockFn()\<F\>

Defined in: [mock-compat.ts:41](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/mock-compat.ts#L41)

A callable spy that records every invocation.

The shape intentionally mirrors the subset of `node:test` `mock.fn()`
that Connectum testing utilities rely on.

## Type Parameters

### F

`F` *extends* (...`args`) => `any`

> **MockFn**(...`args`): `ReturnType`\<`F`\>

Defined in: [mock-compat.ts:42](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/mock-compat.ts#L42)

A callable spy that records every invocation.

The shape intentionally mirrors the subset of `node:test` `mock.fn()`
that Connectum testing utilities rely on.

## Parameters

### args

...`Parameters`\<`F`\>

## Returns

`ReturnType`\<`F`\>

## Properties

### mock

> `readonly` **mock**: `object`

Defined in: [mock-compat.ts:44](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/mock-compat.ts#L44)

Spy metadata.

#### calls

> `readonly` **calls**: readonly [`MockCall`](MockCall.md)\<`Parameters`\<`F`\>, `ReturnType`\<`F`\>\>[]

Ordered list of recorded calls: a fresh copy on every read, as in `node:test`.

#### callCount()

> **callCount**(): `number`

Returns the total number of recorded calls.

##### Returns

`number`

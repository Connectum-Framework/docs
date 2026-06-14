[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / MockFn

# Interface: MockFn()\<F\>

Defined in: test-fixtures/dist/index.d.ts:125

A callable spy that records every invocation.

The shape intentionally mirrors the subset of `node:test` `mock.fn()`
that Connectum testing utilities rely on.

## Type Parameters

### F

`F` *extends* (...`args`) => `any`

> **MockFn**(...`args`): `ReturnType`\<`F`\>

Defined in: test-fixtures/dist/index.d.ts:126

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

Defined in: test-fixtures/dist/index.d.ts:128

Spy metadata.

#### calls

> `readonly` **calls**: readonly [`MockCall`](MockCall.md)\<`Parameters`\<`F`\>\>[]

Ordered list of recorded calls.

#### callCount()

> **callCount**(): `number`

Returns the total number of recorded calls.

##### Returns

`number`

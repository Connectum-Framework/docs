[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / MockFn

# Interface: MockFn()\<F\>

Defined in: [mock-compat.ts:27](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/testing/src/mock-compat.ts#L27)

A callable spy that records every invocation.

The shape intentionally mirrors the subset of `node:test` `mock.fn()`
that Connectum testing utilities rely on.

## Type Parameters

### F

`F` *extends* (...`args`) => `any`

> **MockFn**(...`args`): `ReturnType`\<`F`\>

Defined in: [mock-compat.ts:28](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/testing/src/mock-compat.ts#L28)

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

Defined in: [mock-compat.ts:30](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/testing/src/mock-compat.ts#L30)

Spy metadata.

#### calls

> `readonly` **calls**: readonly [`MockCall`](MockCall.md)\<`Parameters`\<`F`\>\>[]

Ordered list of recorded calls.

#### callCount()

> **callCount**(): `number`

Returns the total number of recorded calls.

##### Returns

`number`

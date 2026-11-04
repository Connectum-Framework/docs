[Connectum API Reference](../../../../index.md) / [@connectum/test-fixtures](../../index.md) / [types](../index.md) / MockStreamOptions

# Interface: MockStreamOptions

Defined in: [types.ts:134](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L134)

Options for [createMockStream](../../index/functions/createMockStream.md).

## Properties

### delayMs?

> `optional` **delayMs?**: `number`

Defined in: [types.ts:140](https://github.com/Connectum-Framework/connectum/blob/main/packages/test-fixtures/src/types.ts#L140)

Delay in milliseconds before each yielded item: a finite number from 0 to 2147483647
(`0` or omitted means no delay). Any other value throws, because the timer would
turn it into 1 ms.

[Connectum API Reference](../../../../index.md) / [@connectum/testing](../../index.md) / [index](../index.md) / MockStreamOptions

# Interface: MockStreamOptions

Defined in: test-fixtures/dist/types.d.ts:93

Options for [createMockStream](../functions/createMockStream.md).

## Properties

### delayMs?

> `optional` **delayMs?**: `number`

Defined in: test-fixtures/dist/types.d.ts:99

Delay in milliseconds before each yielded item: a finite number from 0 to 2147483647
(`0` or omitted means no delay). Any other value throws, because the timer would
turn it into 1 ms.

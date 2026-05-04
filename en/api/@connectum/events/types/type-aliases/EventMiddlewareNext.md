[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventMiddlewareNext

# Type Alias: EventMiddlewareNext

> **EventMiddlewareNext** = (`updatedEvent?`) => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:237](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events/src/types.ts#L237)

Event middleware next function.

Optionally accepts an updated event to replace the current one
in the pipeline (e.g., retry middleware sets a new attempt number
without mutating the readonly original).

## Parameters

### updatedEvent?

[`RawEvent`](../interfaces/RawEvent.md)

## Returns

`Promise`\<`void`\>

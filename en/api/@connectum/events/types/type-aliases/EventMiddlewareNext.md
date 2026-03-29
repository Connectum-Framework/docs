[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventMiddlewareNext

# Type Alias: EventMiddlewareNext()

> **EventMiddlewareNext** = (`updatedEvent?`) => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:220](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L220)

Event middleware next function.

Optionally accepts an updated event to replace the current one
in the pipeline (e.g., retry middleware sets a new attempt number
without mutating the readonly original).

## Parameters

### updatedEvent?

[`RawEvent`](../interfaces/RawEvent.md)

## Returns

`Promise`\<`void`\>

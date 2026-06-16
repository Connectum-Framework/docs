[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventMiddlewareNext

# Type Alias: EventMiddlewareNext

> **EventMiddlewareNext** = (`updatedEvent?`) => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:235](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events/src/types.ts#L235)

Event middleware next function.

Optionally accepts an updated event to replace the current one
in the pipeline (e.g., retry middleware sets a new attempt number
without mutating the readonly original).

## Parameters

### updatedEvent?

[`RawEvent`](../interfaces/RawEvent.md)

## Returns

`Promise`\<`void`\>

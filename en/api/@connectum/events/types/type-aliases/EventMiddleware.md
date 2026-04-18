[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventMiddleware

# Type Alias: EventMiddleware

> **EventMiddleware** = (`event`, `ctx`, `next`) => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:242](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L242)

Event middleware function

## Parameters

### event

[`RawEvent`](../interfaces/RawEvent.md)

### ctx

[`EventContext`](../interfaces/EventContext.md)

### next

[`EventMiddlewareNext`](EventMiddlewareNext.md)

## Returns

`Promise`\<`void`\>

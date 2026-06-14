[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventMiddleware

# Type Alias: EventMiddleware

> **EventMiddleware** = (`event`, `ctx`, `next`) => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:240](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/events/src/types.ts#L240)

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

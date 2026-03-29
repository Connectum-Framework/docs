[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventMiddleware

# Type Alias: EventMiddleware()

> **EventMiddleware** = (`event`, `ctx`, `next`) => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:225](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L225)

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

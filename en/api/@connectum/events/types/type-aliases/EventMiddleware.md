[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventMiddleware

# Type Alias: EventMiddleware()

> **EventMiddleware** = (`event`, `ctx`, `next`) => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:198](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L198)

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

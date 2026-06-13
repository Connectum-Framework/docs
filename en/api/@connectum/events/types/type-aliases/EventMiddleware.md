[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventMiddleware

# Type Alias: EventMiddleware

> **EventMiddleware** = (`event`, `ctx`, `next`) => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:240](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/events/src/types.ts#L240)

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

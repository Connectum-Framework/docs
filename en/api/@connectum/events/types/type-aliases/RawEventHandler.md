[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / RawEventHandler

# Type Alias: RawEventHandler

> **RawEventHandler** = (`event`, `ack`, `nack`) => `Promise`\<`void`\>

Defined in: [packages/events/src/types.ts:38](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L38)

Raw event handler function type.

Adapters call this with the deserialized event and broker-specific
ack/nack callbacks. The EventBus wires these into the EventContext
for end-user handlers.

## Parameters

### event

[`RawEvent`](../interfaces/RawEvent.md)

### ack

() => `Promise`\<`void`\>

### nack

(`requeue?`) => `Promise`\<`void`\>

## Returns

`Promise`\<`void`\>

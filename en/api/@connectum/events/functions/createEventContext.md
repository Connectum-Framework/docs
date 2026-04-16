[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / createEventContext

# Function: createEventContext()

> **createEventContext**(`init`): [`EventContext`](../types/interfaces/EventContext.md)

Defined in: [packages/events/src/EventContext.ts:18](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/EventContext.ts#L18)

Create an EventContext from raw event data.

The ack/nack operations are idempotent -- calling either
multiple times has no effect after the first call.

## Parameters

### init

[`EventContextInit`](../types/interfaces/EventContextInit.md)

## Returns

[`EventContext`](../types/interfaces/EventContext.md)

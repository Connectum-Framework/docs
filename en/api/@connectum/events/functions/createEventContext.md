[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / createEventContext

# Function: createEventContext()

> **createEventContext**(`init`): [`EventContext`](../types/interfaces/EventContext.md)

Defined in: [packages/events/src/EventContext.ts:18](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/events/src/EventContext.ts#L18)

Create an EventContext from raw event data.

The ack/nack operations are idempotent -- calling either
multiple times has no effect after the first call.

## Parameters

### init

[`EventContextInit`](../types/interfaces/EventContextInit.md)

## Returns

[`EventContext`](../types/interfaces/EventContext.md)

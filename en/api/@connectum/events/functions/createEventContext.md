[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / createEventContext

# Function: createEventContext()

> **createEventContext**(`init`): [`EventContext`](../types/interfaces/EventContext.md)

Defined in: [packages/events/src/EventContext.ts:18](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/EventContext.ts#L18)

Create an EventContext from raw event data.

The ack/nack operations are idempotent -- calling either
multiple times has no effect after the first call.

## Parameters

### init

[`EventContextInit`](../types/interfaces/EventContextInit.md)

## Returns

[`EventContext`](../types/interfaces/EventContext.md)

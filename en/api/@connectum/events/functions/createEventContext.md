[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / createEventContext

# Function: createEventContext()

> **createEventContext**(`init`): [`EventContext`](../types/interfaces/EventContext.md)

Defined in: [packages/events/src/EventContext.ts:18](https://github.com/Connectum-Framework/connectum/blob/9c808efa603eaacdf10ddef6780ea699f46a1f35/packages/events/src/EventContext.ts#L18)

Create an EventContext from raw event data.

The ack/nack operations are idempotent -- calling either
multiple times has no effect after the first call.

## Parameters

### init

[`EventContextInit`](../types/interfaces/EventContextInit.md)

## Returns

[`EventContext`](../types/interfaces/EventContext.md)

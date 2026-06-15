[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / dlqMiddleware

# Function: dlqMiddleware()

> **dlqMiddleware**(`options`, `adapter`): [`EventMiddleware`](../types/type-aliases/EventMiddleware.md)

Defined in: [packages/events/src/middleware/dlq.ts:29](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/events/src/middleware/dlq.ts#L29)

Create a DLQ middleware that catches errors from inner middleware
(retry), publishes to DLQ topic, and acks the original.

## Parameters

### options

[`DlqOptions`](../types/interfaces/DlqOptions.md)

### adapter

[`EventAdapter`](../types/interfaces/EventAdapter.md)

## Returns

[`EventMiddleware`](../types/type-aliases/EventMiddleware.md)

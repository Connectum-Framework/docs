[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / dlqMiddleware

# Function: dlqMiddleware()

> **dlqMiddleware**(`options`, `adapter`): [`EventMiddleware`](../types/type-aliases/EventMiddleware.md)

Defined in: [packages/events/src/middleware/dlq.ts:29](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/middleware/dlq.ts#L29)

Create a DLQ middleware that catches errors from inner middleware
(retry), publishes to DLQ topic, and acks the original.

## Parameters

### options

[`DlqOptions`](../types/interfaces/DlqOptions.md)

### adapter

[`EventAdapter`](../types/interfaces/EventAdapter.md)

## Returns

[`EventMiddleware`](../types/type-aliases/EventMiddleware.md)

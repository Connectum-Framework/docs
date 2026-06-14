[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / dlqMiddleware

# Function: dlqMiddleware()

> **dlqMiddleware**(`options`, `adapter`): [`EventMiddleware`](../types/type-aliases/EventMiddleware.md)

Defined in: [packages/events/src/middleware/dlq.ts:29](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/events/src/middleware/dlq.ts#L29)

Create a DLQ middleware that catches errors from inner middleware
(retry), publishes to DLQ topic, and acks the original.

## Parameters

### options

[`DlqOptions`](../types/interfaces/DlqOptions.md)

### adapter

[`EventAdapter`](../types/interfaces/EventAdapter.md)

## Returns

[`EventMiddleware`](../types/type-aliases/EventMiddleware.md)

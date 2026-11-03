[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / dlqMiddleware

# Function: dlqMiddleware()

> **dlqMiddleware**(`options`, `adapter`, `onPublishFailed?`): [`EventMiddleware`](../types/type-aliases/EventMiddleware.md)

Defined in: [packages/events/src/middleware/dlq.ts:51](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/middleware/dlq.ts#L51)

Create a DLQ middleware that catches errors from inner middleware
(retry), publishes to DLQ topic, and acks the original.

If the publish to the DLQ fails, the original is nacked without requeue and the error is not
rethrown, so the event is no longer eligible for redelivery. `onPublishFailed` is the only
place that failure becomes visible; `createEventBus` forwards it to its `observer` as a
`dlq-failed` event. A throw from the callback, or a rejection of the promise it returns, is dropped, because reporting must not decide what
happens to the event.

## Parameters

### options

[`DlqOptions`](../types/interfaces/DlqOptions.md)

### adapter

`Pick`\<[`EventAdapter`](../types/interfaces/EventAdapter.md), `"publish"`\>

### onPublishFailed?

(`failure`) => `void` \| `Promise`\<`void`\>

## Returns

[`EventMiddleware`](../types/type-aliases/EventMiddleware.md)

## Throws

When `options.topic` is not a string.

## Throws

When `options.topic` is empty or blank.

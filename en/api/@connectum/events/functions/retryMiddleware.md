[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / retryMiddleware

# Function: retryMiddleware()

> **retryMiddleware**(`options?`): [`EventMiddleware`](../types/type-aliases/EventMiddleware.md)

Defined in: [packages/events/src/middleware/retry.ts:48](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events/src/middleware/retry.ts#L48)

Create a retry middleware with configurable options.

On handler failure, retries up to `maxRetries` times with
the configured backoff strategy. If all retries exhaust,
the error is re-thrown for the next middleware (e.g., DLQ).

## Parameters

### options?

[`RetryOptions`](../types/interfaces/RetryOptions.md)

## Returns

[`EventMiddleware`](../types/type-aliases/EventMiddleware.md)

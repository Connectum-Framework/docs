[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / retryMiddleware

# Function: retryMiddleware()

> **retryMiddleware**(`options?`): [`EventMiddleware`](../types/type-aliases/EventMiddleware.md)

Defined in: [packages/events/src/middleware/retry.ts:48](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/middleware/retry.ts#L48)

Create a retry middleware with configurable options.

On handler failure, retries up to `maxRetries` times with
the configured backoff strategy. If all retries exhaust,
the error is re-thrown for the next middleware (e.g., DLQ).

## Parameters

### options?

[`RetryOptions`](../types/interfaces/RetryOptions.md)

## Returns

[`EventMiddleware`](../types/type-aliases/EventMiddleware.md)

[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / retryMiddleware

# Function: retryMiddleware()

> **retryMiddleware**(`options?`): [`EventMiddleware`](../types/type-aliases/EventMiddleware.md)

Defined in: [packages/events/src/middleware/retry.ts:155](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/middleware/retry.ts#L155)

Create a retry middleware with configurable options.

On handler failure, retries up to `maxRetries` times with
the configured backoff strategy. If all retries exhaust,
the error is re-thrown for the next middleware (e.g., DLQ).

When `ctx.signal` aborts while the event waits for its next attempt, the outcome depends on the
reason. A stop (the server's shutdown signal, or the drain abort of `EventBus.stop()`) returns
the event to the broker with `ctx.nack(true)` and ends the middleware without an error, so the
dead-letter middleware does not see it. Because the retry budget is not carried over, the broker
delivers the event again with a fresh budget; whether it does, and after what delay, is up to
the broker. The per-event `handlerTimeout` (a `TimeoutError`) is a failure and is thrown.

## Parameters

### options?

[`RetryOptions`](../types/interfaces/RetryOptions.md)

## Returns

[`EventMiddleware`](../types/type-aliases/EventMiddleware.md)

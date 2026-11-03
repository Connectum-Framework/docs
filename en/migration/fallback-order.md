---
title: Fallback Stands Outside Retry and Circuit Breaker
description: From 1.3.0, createDefaultInterceptors places the fallback in front of retry and the circuit breaker, so retries run, the breaker opens, and the fallback value is served after both.
docType: migration
---

# Fallback Stands Outside Retry and Circuit Breaker

> Applies to `@connectum/interceptors` 1.3.0.

## Does this apply to you?

You need to act only if you pass `fallback` to `createDefaultInterceptors()` together with `retry` or `circuitBreaker`. Without `fallback`, the chain is unchanged. If you compose the interceptors yourself, nothing changes until you reorder them.

## What changed

Until 1.3.0 the fallback stood inside `circuitBreaker` and `retry`. It answered the first failure of the handler with a value, so neither interceptor ever saw an error:

| With `fallback` and ... | Before | From 1.3.0 |
|---|---|---|
| `retry: { maxRetries: 3 }`, handler always fails | Handler called once, fallback value served | Handler called four times, then the fallback value is served |
| `retry`, handler fails once, then succeeds | Fallback value served | The response of the successful retry; the fallback is not asked |
| `circuitBreaker: { threshold: 2 }`, handler always fails | Breaker never opens; every call reaches the handler | Breaker opens after two failures; later calls do not reach the handler and are answered with the fallback value |

The `handler` of the fallback now receives the error that ended the call: the last failure after the retries, or the `Unavailable` "Circuit breaker is open" error while the breaker is open. A code that retry does not repeat (`Internal`, `NotFound`, ...) is not retried, and the `handler` gets that first error. With a fallback, validation stands directly outside it, so an invalid request is still rejected with `InvalidArgument`. The full chain is in [Fallback position](/en/guide/interceptors/built-in#fallback-position).

Other consequences of the new order, all of them for chains that enable a `fallback`:

- **Cancellation reaches the handler.** After the caller cancels or the deadline passes, retry raises `Canceled` (or `DeadlineExceeded`). That error now passes through the fallback, so the `handler` is called with it. The client still receives the cancellation or the deadline from the layer that raised it, but side effects of the `handler` (metrics, logs, a cache write) now also run for such calls. Filter on the error code in the `handler` if they must not.
- **An error of the handler itself is not repeated.** If the `handler` throws, the error goes straight to the error handler: retry does not repeat it and the breaker does not count it. Before, a throwing `handler` could open the breaker.
- **Validation beside an open breaker.** With the breaker open, an invalid request now gets `InvalidArgument` (validation stands outside). Without a fallback it still gets `Unavailable` "Circuit breaker is open", because validation stays behind the breaker there. A `failurePredicate` that counts `InvalidArgument` therefore counts invalid requests only in a chain without a fallback.
- **Streams.** With `skipStreaming: false` on both `retry` and `fallback`, the opening of a stream that fails with `Unavailable` is attempted `maxRetries + 1` times, and then the fallback message is the only message of the stream. With the default `skipStreaming: true` streams bypass both, as before.

## Required changes

- **Check the load on the handler.** A failing dependency now receives the retries you configured, before the fallback is used. Lower `maxRetries` if that is too much.
- **Check what reads the fallback.** If a dashboard counted fallback answers as a measure of failed first attempts, it now counts exhausted retries and breaker refusals; if the `handler` has side effects, see the cancellation point above.
- **Composing the chain yourself:** list `createFallbackInterceptor` before `createCircuitBreakerInterceptor` and `createRetryInterceptor`, and the validation interceptor before the fallback.

## Verify

Call a method whose handler always fails and count the handler calls: with `retry: { maxRetries: 3 }` and a fallback you must see four, and with `circuitBreaker: { threshold: 2 }` you must see two over four sequential calls while every caller receives the fallback value.

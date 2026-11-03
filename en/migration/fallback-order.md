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

The `handler` of the fallback now receives the final error: the last failure after the retries, or the `Unavailable` "Circuit breaker is open" error while the breaker is open. With a fallback, validation stands directly outside it, so an invalid request is still rejected with `InvalidArgument`. The full chain is in [Fallback position](/en/guide/interceptors/built-in#fallback-position).

## Required changes

- **Check the load on the handler.** A failing dependency now receives the retries you configured, before the fallback is used. Lower `maxRetries` if that is too much.
- **Check what reads the fallback.** If a dashboard counted fallback answers as a measure of failed first attempts, it now counts exhausted retries and breaker refusals.
- **Composing the chain yourself:** list `createFallbackInterceptor` before `createCircuitBreakerInterceptor` and `createRetryInterceptor`, and the validation interceptor before the fallback.

## Verify

Call a method whose handler always fails and count the handler calls: with `retry: { maxRetries: 3 }` and a fallback you must see four, and with `circuitBreaker: { threshold: 2 }` you must see two over four sequential calls while every caller receives the fallback value.

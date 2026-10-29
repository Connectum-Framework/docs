---
title: Interceptor Option Validation
description: From 1.3.0, the resilience interceptors and createDefaultInterceptors refuse fractional or oversized numbers, fallback true and null or non-object values, connectum init no longer offers fallback, validation stands outside the fallback, and the fallback handler must return the response message.
docType: migration
---

# Interceptor Option Validation

> Applies to `@connectum/interceptors` and `@connectum/cli` 1.3.0.

## Does this apply to you?

You need to act only if one of these is true:

- you pass a **fractional** number, or a delay **above 2147483647 ms**, to `createTimeoutInterceptor`, `createBulkheadInterceptor`, `createCircuitBreakerInterceptor` or `createRetryInterceptor` (directly or through `createDefaultInterceptors()`);
- you pass `fallback: true` to `createDefaultInterceptors()`;
- you pass `null`, a number, a string, an array or a function as the value of a key of `createDefaultInterceptors()` (for example `{ timeout: null }` or `{ retry: 3 }`), or anything other than a boolean as `validation`;
- you run `connectum init --resilience` with `fallback` in the list (a script, a CI job or a template);
- code or an alert matches the **text** of the bulkhead refusal.

If your options are already integers within the ranges below and your keys hold `true`, `false` or an options object, nothing changes.

## What changed

Until 1.3.0 these values were accepted and ran with different behavior than asked for:

| Value | Before | From 1.3.0 |
|---|---|---|
| `timeout.duration` above 2147483647 | The platform timer fired after 1 ms: a very long timeout expired at once | Throws `RangeError` when the interceptor is created |
| A fraction in `capacity`, `queueSize`, `threshold`, `halfOpenAfter`, `initialDelay`, `maxDelay` or `duration` | Passed on to the library as is | Throws `RangeError` |
| `fallback: true` | Silently ignored: no fallback interceptor was added | Throws `TypeError`; the type is `false \| FallbackOptions` |
| `null`, `0`, `5000`, `"30s"`, `[]` or a function as a key of `createDefaultInterceptors()` | The interceptor stayed off, with no message | Throws `TypeError` naming the key |
| `createFallbackInterceptor({})` | `Error` | `TypeError` |
| `connectum init --resilience fallback` | Generated `fallback: true`, which did nothing | Refused with `invalid --resilience "fallback"` and a hint |

A value that is not a number throws `TypeError`; a number outside the rule throws `RangeError`. The message names the factory, the option, the rule and the received value. The accepted ranges are in [Option ranges and validation](/en/guide/interceptors/built-in#option-ranges-and-validation). `retry.maxRetries` accepts the same values as before (a fraction such as `0.5` is still valid); only the error class for an invalid value changed.

The bulkhead refusal keeps the code `ResourceExhausted`. Its text is now `Bulkhead capacity exceeded (capacity: N, queueSize: M)` with the configured limits; before, it printed the policy's free slots under the label `active`, so a full bulkhead read as idle.

## Required changes

- **Round numbers and cap delays.** Pass integers. For a very long timeout use at most 2147483647 ms (about 24.8 days); to run without a time limit, leave `timeout` out of the chain.
- **Replace `fallback: true`.** Pass `fallback: { handler }` with a function that returns the response message, or remove the key.
- **Replace non-object values.** Use `false` to disable an interceptor, `true` for its defaults, or an options object. Do not pass `null`, `0` or a number to mean "off" or "use this value".
- **Drop `fallback` from `--resilience`.** The remaining values are `timeout`, `bulkhead`, `circuitBreaker` and `retry`. Add the fallback interceptor to `src/server.ts` yourself.
- **Match the code, not the text.** If anything matches the bulkhead message, compare `err.code` with `Code.ResourceExhausted`.

## Before and after

```typescript
import { createDefaultInterceptors } from '@connectum/interceptors';

// Before: accepted
createDefaultInterceptors({
  timeout: { duration: 2_592_000_000 }, // 30 days: the timer fired after 1 ms
  bulkhead: { capacity: 2.5 },
  retry: null,                          // looked configured, retry stayed off
  fallback: true,                       // looked enabled, did nothing
});

// From 1.3.0
createDefaultInterceptors({
  timeout: { duration: 2_147_483_647 }, // the longest delay the timer honors
  bulkhead: { capacity: 3 },
  retry: false,                         // or true, or an options object
  fallback: { handler: () => ({ items: [] }) },
});
```

## Fallback: validation order and handler result {#fallback-order-and-result}

You need to act if you enable `fallback` in `createDefaultInterceptors()` or build a chain with `createFallbackInterceptor`.

| Case | Before | Now |
|---|---|---|
| `fallback` enabled, a request breaks a validation rule | The caller got the fallback value as a successful response | The caller gets `INVALID_ARGUMENT`; neither the handler nor the fallback `handler` runs |
| The fallback `handler` returns a plain object with the response fields (`{ items: [] }`) | On a server the call failed with a `serialize binary: ...` text | The object is turned into the response message |
| The `handler` returns `undefined`, `null`, a string, or an object that does not fit the response type (an unknown key, a number in a string field, a non-array in a repeated field, ...) | `undefined` failed on a server with a `serialize binary: ...` text; the other values were not checked and were passed on as the response | `TypeError` naming `createFallbackInterceptor`, the expected type and the path of the problem; behind the error handler the client gets `Internal: internal error` |

The default chain order is now `errorHandler, timeout, bulkhead, circuitBreaker, retry, validation, fallback, serializer`. It differs from before only when `fallback` is enabled.

**Action:** if you compose the chain yourself, put the validation interceptor before the fallback interceptor. If your `handler` returns a plain object, check that every key is a field of the method's response; if it returns something else, return `create(OutputSchema, { ... })`. If something relied on a rejected request being answered by the fallback value, handle `INVALID_ARGUMENT` in the caller instead.

## Verify

Start the service: every refused value throws while the chain is built, before the first request, so a configuration that starts is valid. To check a configuration in a test, call the factory or `createDefaultInterceptors()` with the same options and assert that it does not throw.

---
title: Interceptor Option Validation
description: From 1.3.0, the interceptor factories and createDefaultInterceptors refuse fractional or oversized numbers, fallback true, unknown keys, null or non-object values, wrong option types and method filter keys that never match, and connectum init no longer offers fallback.
docType: migration
---

# Interceptor Option Validation

> Applies to `@connectum/interceptors` and `@connectum/cli` 1.3.0.

## Does this apply to you?

You need to act only if one of these is true:

- you pass a **fractional** number, or a delay **above 2147483647 ms**, to `createTimeoutInterceptor`, `createBulkheadInterceptor`, `createCircuitBreakerInterceptor` or `createRetryInterceptor` (directly or through `createDefaultInterceptors()`);
- you pass `fallback: true` to `createDefaultInterceptors()`;
- you pass `null`, a number, a string, an array or a function as the value of a key of `createDefaultInterceptors()` (for example `{ timeout: null }` or `{ retry: 3 }`), or anything other than a boolean as `validation`;
- you pass a key to `createDefaultInterceptors()` that it does not know (a typo such as `timout`, or `logger` / `methodFilter`, which are not part of the default chain), or `null` instead of the options object;
- you pass a value that is not a boolean to `skipStreaming`, `skipHealthCheck`, `includeTransport`, `includeBodies`, `skipGrpcServices`, `alwaysEmitImplicit` or `ignoreUnknownFields`, a `level` of the logger other than `debug`, `info`, `warn` or `error`, a `logger` or `failurePredicate` that is not a function, `retryableCodes` that is not an array of Connect codes, or `null` instead of the options object of any factory;
- you register a key in `createMethodFilterInterceptor()` that is not `*`, `Service/*` or `Service/Method` (for example `/Unary`, `acme.v1.Svc/`, `*/*`, `acme.v1.Svc/Un*`), a value that is not an array of functions, or a `null` entry in such an array;
- your logs or alerts rely on the logger skipping a service only because its name contains `grpc.health` inside a longer segment (such as `acme.grpc.healthcare.v1.Svc`);
- you run `connectum init --resilience` with `fallback` in the list (a script, a CI job or a template);
- code or an alert matches the **text** of the bulkhead refusal.

If your options are already integers within the ranges below, your keys hold `true`, `false` or an options object, and the other options have the types above, nothing changes.

## What changed

Until 1.3.0 these values were accepted and ran with different behavior than asked for:

| Value | Before | From 1.3.0 |
|---|---|---|
| `timeout.duration` above 2147483647 | The platform timer fired after 1 ms: a very long timeout expired at once | Throws `RangeError` when the interceptor is created |
| A fraction in `capacity`, `queueSize`, `threshold`, `halfOpenAfter`, `initialDelay`, `maxDelay` or `duration` | Passed on to the library as is | Throws `RangeError` |
| `fallback: true` | Silently ignored: no fallback interceptor was added | Throws `TypeError`; the type is `false \| FallbackOptions` |
| `null`, `0`, `5000`, `"30s"`, `[]` or a function as a key of `createDefaultInterceptors()` | The interceptor stayed off, with no message | Throws `TypeError` naming the key |
| An unknown key of `createDefaultInterceptors()`, such as `{ timout: { duration: 10 } }` or `{ logger: true }` | Ignored: the interceptor you asked for was not added | Throws `TypeError` naming the key and listing the known keys |
| `null`, a number, a string or an array in place of an options object (`createTimeoutInterceptor(null)`, `createDefaultInterceptors(null)`) | A raw `Cannot read properties of null`, or silently read as empty | Throws `TypeError` naming the factory |
| `"no"`, `"yes"`, `1`, `0` or `null` for a boolean option such as `skipStreaming` or `skipGrpcServices` | Read as true or false by truthiness | Throws `TypeError` naming the option |
| `level: "bogus"` for the logger | Accepted; nothing was logged | Throws `RangeError` listing `debug`, `info`, `warn`, `error` |
| `logger` or `failurePredicate` that is not a function | Accepted; the first logged or failed call misbehaved | Throws `TypeError` |
| `retryableCodes: null`, `"14"` or `{}` | Accepted; the first failing call became `Internal`, or nothing was retried | Throws `TypeError`; a number that is not a Connect code throws `RangeError` |
| A method filter key such as `/Unary`, `acme.v1.Svc/`, `*/*`, `acme.v1.Svc/Un*`, `a/b/*` or one with a space | Accepted; the interceptors under it never ran | Throws `Error` when the filter is created |
| A method filter value that is a string, `null`, or an array with a `null` entry | A `null` entry was skipped; a string failed on the call | Throws `TypeError` naming the key |
| Logger `skipHealthCheck: true` and a service named like `acme.grpc.healthcare.v1.Svc` | The service was never logged | Only the `grpc.health` package is skipped; the service is logged |
| `createFallbackInterceptor({})` | `Error` | `TypeError` |
| `connectum init --resilience fallback` | Generated `fallback: true`, which did nothing | Refused with `invalid --resilience "fallback"` and a hint |

A value that is not a number throws `TypeError`; a number outside the rule throws `RangeError`. The message names the factory, the option, the rule and the received value. The accepted ranges are in [Option ranges and validation](/en/guide/interceptors/built-in#option-ranges-and-validation). `retry.maxRetries` accepts the same values as before (a fraction such as `0.5` is still valid); only the error class for an invalid value changed.

The bulkhead refusal keeps the code `ResourceExhausted`. Its text is now `Bulkhead capacity exceeded (capacity: N, queueSize: M)` with the configured limits; before, it printed the policy's free slots under the label `active`, so a full bulkhead read as idle.

## Required changes

- **Round numbers and cap delays.** Pass integers. For a very long timeout use at most 2147483647 ms (about 24.8 days); to run without a time limit, leave `timeout` out of the chain.
- **Replace `fallback: true`.** Pass `fallback: { handler }` with a function that returns the response message, or remove the key.
- **Replace non-object values.** Use `false` to disable an interceptor, `true` for its defaults, or an options object. Do not pass `null`, `0` or a number to mean "off" or "use this value".
- **Fix or remove unknown keys.** Spell the key as listed in [Customizing the Default Chain](/en/guide/interceptors/built-in#customizing-the-default-chain), and add the logger or the method filter to the `interceptors` array with their own factories.
- **Pass real booleans, functions, levels and codes.** Use `true` or `false` for flags, a function for `logger` and `failurePredicate`, one of `debug`, `info`, `warn`, `error` for `level`, and an array of `Code` values for `retryableCodes`.
- **Correct method filter keys.** Use `*`, `Service/*` or `Service/Method` with the exact protobuf names, and put every interceptor in an array. A key that used to be accepted never matched, so its interceptors were not running; fixing the key turns them on, which can change the behavior of the services it now covers.
- **Check what the logger skips.** If you relied on the logger omitting a service whose name contains `grpc.health` inside a longer segment, set up your own filter, for example with `createMethodFilterInterceptor`.
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

## Verify

Start the service: every refused value throws while the chain is built, before the first request, so a configuration that starts is valid. To check a configuration in a test, call the factory or `createDefaultInterceptors()` with the same options and assert that it does not throw.

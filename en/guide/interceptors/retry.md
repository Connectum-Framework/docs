---
title: Retry interceptor
description: Retry eligible transient failures while respecting cancellation and idempotency.
docType: how-to
---

# Retry interceptor

Retry is opt-in because it can execute work more than once. Enable it only for
operations whose side effects are safe to repeat:

```typescript
import { createRetryInterceptor } from '@connectum/interceptors';

const retry = createRetryInterceptor({ maxRetries: 2, initialDelay: 200, maxDelay: 5_000 });
```

Use the `retry` key of `createDefaultInterceptors()` for the same policy. See
[RetryOptions](/en/api/@connectum/interceptors/interfaces/RetryOptions) for
the eligible error-code policy and exact options.

## Backoff and cancellation

The pause between attempts uses the `cockatiel` dependency's `ExponentialBackoff`
with its default decorrelated-jitter generator, scaled by `initialDelay` and
capped at `maxDelay`. Delays are randomized: there is no guaranteed exact
sequence or fixed multiplier. Use a custom interceptor for a fixed schedule.

Cancellation interrupts a pending backoff and prevents further attempts. If
work is already running, retry waits for it to settle, then rejects a late
success with the cancellation reason. This keeps a surrounding bulkhead slot
occupied until the work finishes. An outer timeout or the transport can stop
the caller's wait earlier. Cancellation does not roll back committed work.

## Streaming scope

Streaming calls are skipped by default. With `skipStreaming: false`, retry can
repeat failures while opening the response. It cannot restart an iterator that
fails after opening.

## Option limits

`skipStreaming` must be a boolean. `retryableCodes` must be an array of Connect
codes; an empty array retries nothing. Invalid types throw `TypeError`, and
numeric entries outside the Connect codes throw `RangeError` at construction.

`maxRetries` must be a finite number at least 0; fractional values such as `0.5`
are accepted. The default when enabled is 3. `initialDelay` and `maxDelay` must
be integers from 0 to 2147483647 milliseconds; their defaults are 200 and 5000.
Invalid types or numeric ranges fail at factory construction.

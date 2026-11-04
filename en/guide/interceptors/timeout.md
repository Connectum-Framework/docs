---
title: Timeout interceptor
description: Bound the caller's wait and propagate cancellation to cooperative downstream work.
docType: how-to
---

# Timeout interceptor

Timeout is opt-in. It limits the caller's wait and forwards its deadline and
caller cancellation to downstream work:

```typescript
import { createTimeoutInterceptor } from '@connectum/interceptors';

const timeout = createTimeoutInterceptor({ duration: 10_000 });
```

Use `timeout: { duration: 10_000 }` in `createDefaultInterceptors()` for the
same policy. Its own deadline rejects with `DeadlineExceeded`. Caller
cancellation preserves an existing `ConnectError` and its code, message,
metadata and details; other caller reasons become `Canceled`. The first
observed cancellation cause wins.

## Cooperate with cancellation

Custom middleware reads `req.signal`; handlers read `ctx.signal` and pass it to
cancellable I/O. A handler that ignores the signal can still finish and commit
side effects after the caller stops waiting. Cancellation does not roll them
back. The 1.2.x timeout did not forward cancellation to downstream handler work.

During a unary call, the downstream signal follows the caller's signal and
receives its abort reason. The link is released after the call, so repeated
calls may share a long-lived shutdown signal without accumulating links.
An abort observed after a signal-unaware handler has returned no longer
changes that finished call's signal; HTTP cancellation can arrive that late.
An opened stream with `skipStreaming: false` keeps following caller
cancellation for its lifetime.

## Streaming scope

Streaming calls are skipped by default. With `skipStreaming: false`, timeout
covers opening the response, not subsequent iteration. Successful opening
clears its timer without aborting the stream; later caller cancellation still
reaches that stream.

## Option limits

`duration` must be an integer from 1 to 2147483647 milliseconds; its default when
enabled is 30000. A wrong type throws `TypeError`; an out-of-range numeric value
throws `RangeError`, naming the factory, option, rule and received value.

`skipStreaming` accepts only booleans. A string such as `"no"` throws
`TypeError` instead of being interpreted by truthiness.

The upper bound is the platform timer limit (about 24.8 days). A longer timer
can fire after 1 ms instead. To have no timeout, omit the interceptor.
See [TimeoutOptions](/en/api/@connectum/interceptors/interfaces/TimeoutOptions).

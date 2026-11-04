---
title: Bulkhead interceptor
description: Limit concurrent RPC work and bound the waiting queue.
docType: how-to
---

# Bulkhead interceptor

Bulkhead is opt-in. Give work a bounded number of active slots and a bounded
waiting queue:

```typescript
import { createBulkheadInterceptor } from '@connectum/interceptors';

const bulkhead = createBulkheadInterceptor({ capacity: 20, queueSize: 20 });
```

Use `bulkhead: { capacity: 20, queueSize: 20 }` in
`createDefaultInterceptors()` for the same policy. In the default chain bulkhead
wraps the retry loop, so attempts for one logical request share its slot.

## Refusal and occupied slots

A request that finds every slot and the whole queue taken is rejected with
`ResourceExhausted` and `Bulkhead capacity exceeded (capacity: N, queueSize: M)`.
The text contains configured limits, not live occupancy. Branch on the code;
the human-readable text can change between releases.

Retry waits for already running work to settle after cancellation. This keeps
the bulkhead slot occupied until that work actually finishes; an outer timeout
or transport can stop the caller's wait earlier. A slot limit cannot forcibly
stop signal-unaware work.

A queued call leaves the queue as soon as its signal aborts, freeing the place
without running its handler. It fails with `Canceled`, preserving the abort
reason itself when that is a `ConnectError`. An already aborted call fails the
same way without taking a slot or queue place. A slot already held remains
occupied until downstream work settles.

## Option limits

`capacity` must be an integer of at least 1; `queueSize` an integer of at least
0. Both default to 10 when enabled. Wrong types throw `TypeError`; invalid
numeric ranges throw `RangeError` at factory construction, before requests.

`skipStreaming` defaults to `true` and accepts only booleans; other types throw
`TypeError` at construction.

See [BulkheadOptions](/en/api/@connectum/interceptors/interfaces/BulkheadOptions)
and [option-validation migration](/en/migration/interceptor-options).

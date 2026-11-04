---
title: Circuit breaker interceptor
description: Fail fast against a failing upstream and classify which failures affect its circuit.
docType: how-to
---

# Circuit breaker interceptor

A circuit breaker is an outbound/client-side pattern: it protects the caller
from a failing upstream and gives that upstream room to recover. On an inbound
server it becomes error-rate load shedding; prefer timeout and bulkhead for
inbound protection.

```typescript
import { createConnectTransport } from '@connectrpc/connect-node';
import { createCircuitBreakerInterceptor } from '@connectum/interceptors';

const transport = createConnectTransport({
  baseUrl: 'http://upstream:5000',
  httpVersion: '1.1',
  interceptors: [createCircuitBreakerInterceptor({ threshold: 5, halfOpenAfter: 30_000 })],
});
```

Each factory call creates one breaker shared by every call through that
interceptor. Upstreams that must trip independently need separate interceptors
on separate transports. Streaming calls are skipped by default.

## Classify failures

By default infrastructure codes count: `Unknown`, `DeadlineExceeded`, `Internal`,
`Unavailable`, `DataLoss`, `ResourceExhausted`, plus non-`ConnectError` failures.
Business codes such as `InvalidArgument`, `NotFound`, `FailedPrecondition` and
`AlreadyExists` do not trip it; in half-open state they close it.

Compose with the supplied default predicate instead of replacing it accidentally:

```typescript
import { Code, ConnectError } from '@connectrpc/connect';

createCircuitBreakerInterceptor({
  failurePredicate: (error, defaultPredicate) =>
    defaultPredicate(error) && !(error instanceof ConnectError && error.code === Code.ResourceExhausted),
});
```

The default is also exported as `defaultFailurePredicate`. Returning `true`
unconditionally restores the legacy behavior where every error trips the circuit.
In the default chain the breaker wraps retry, so one logical request increments
the failure count at most once regardless of retry attempts.

## Half-open probe

After `halfOpenAfter`, exactly one call runs as the probe. Calls arriving while
it runs fail immediately with `Unavailable` and
`Circuit breaker is open (N consecutive failures)`. They neither wait nor reach
the handler. Success closes the circuit; failure opens it for another
`halfOpenAfter`. Put timeout before the breaker to bound a slow probe.

## Option limits

`threshold` is an integer of at least 1 (default 5). `halfOpenAfter` is an integer
from 0 to 2147483647 milliseconds (default 30000). Invalid types or ranges fail
when the factory is called. `skipStreaming` must be a boolean and a supplied
`failurePredicate` must be a function; invalid types throw `TypeError`. See
[CircuitBreakerOptions](/en/api/@connectum/interceptors/interfaces/CircuitBreakerOptions).

[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [circuit-breaker](../index.md) / createCircuitBreakerInterceptor

# Function: createCircuitBreakerInterceptor()

> **createCircuitBreakerInterceptor**(`options?`): `Interceptor`

Defined in: [circuit-breaker.ts:104](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/circuit-breaker.ts#L104)

Create circuit breaker interceptor

Prevents cascading failures by opening circuit after consecutive failures.
When circuit is open, requests fail immediately without calling the service.

Circuit States:
- Closed (normal): Requests pass through
- Open (failing): Requests rejected immediately
- Half-Open (testing): Single request allowed to test recovery

By default only infrastructure errors trip the breaker (see
[defaultFailurePredicate](defaultFailurePredicate.md)); business codes like invalid_argument or
not_found never do. Customize via [CircuitBreakerOptions.failurePredicate](../../interfaces/CircuitBreakerOptions.md#failurepredicate).

The circuit breaker is an outbound/client-side pattern: it protects the
caller from a sick upstream and gives that upstream room to recover. On a
server's inbound stack it degenerates into error-rate load shedding —
prefer timeout + bulkhead for inbound protection.

Every call creates one breaker, and that single breaker counts the failures of
every request it covers (streaming calls are skipped by default) that passes
through the returned interceptor, whatever the service or method. Calls to different upstreams need one interceptor each.

`threshold` must be an integer of at least 1 and `halfOpenAfter` an integer from
0 to 2147483647 milliseconds; anything else throws at construction (`TypeError`
for a non-number, `RangeError` otherwise).

## Parameters

### options?

[`CircuitBreakerOptions`](../../interfaces/CircuitBreakerOptions.md) = `{}`

Circuit breaker options

## Returns

`Interceptor`

ConnectRPC interceptor

## Examples

**Client-side usage with transport (recommended placement)**

```typescript
import { createConnectTransport } from '@connectrpc/connect-node';
import { createCircuitBreakerInterceptor } from '@connectum/interceptors';

const transport = createConnectTransport({
  baseUrl: 'http://localhost:5000',
  httpVersion: '1.1',
  interceptors: [
    createCircuitBreakerInterceptor({
      threshold: 5,           // Open after 5 consecutive failures
      halfOpenAfter: 30000,   // Try again after 30 seconds
    }),
  ],
});
```

**Custom failure classification (compose with the default)**

```typescript
import { Code, ConnectError } from '@connectrpc/connect';

createCircuitBreakerInterceptor({
  // Never trip on upstream per-client rate limits
  failurePredicate: (err, def) =>
    def(err) && !(err instanceof ConnectError && err.code === Code.ResourceExhausted),
});
```

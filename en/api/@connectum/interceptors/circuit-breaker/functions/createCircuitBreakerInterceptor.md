[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [circuit-breaker](../index.md) / createCircuitBreakerInterceptor

# Function: createCircuitBreakerInterceptor()

> **createCircuitBreakerInterceptor**(`options?`): `Interceptor`

Defined in: [circuit-breaker.ts:94](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/interceptors/src/circuit-breaker.ts#L94)

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

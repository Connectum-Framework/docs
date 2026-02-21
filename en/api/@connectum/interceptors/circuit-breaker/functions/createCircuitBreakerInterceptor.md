[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [circuit-breaker](../index.md) / createCircuitBreakerInterceptor

# Function: createCircuitBreakerInterceptor()

> **createCircuitBreakerInterceptor**(`options?`): `Interceptor`

Defined in: [circuit-breaker.ts:61](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/interceptors/src/circuit-breaker.ts#L61)

Create circuit breaker interceptor

Prevents cascading failures by opening circuit after consecutive failures.
When circuit is open, requests fail immediately without calling the service.

Circuit States:
- Closed (normal): Requests pass through
- Open (failing): Requests rejected immediately
- Half-Open (testing): Single request allowed to test recovery

## Parameters

### options?

[`CircuitBreakerOptions`](../../@connectum/interceptors/interfaces/CircuitBreakerOptions.md) = `{}`

Circuit breaker options

## Returns

`Interceptor`

ConnectRPC interceptor

## Examples

```typescript
import { createServer } from '@connectum/core';
import { createCircuitBreakerInterceptor } from '@connectum/interceptors';
import { myRoutes } from './routes.js';

const server = createServer({
  services: [myRoutes],
  interceptors: [
    createCircuitBreakerInterceptor({
      threshold: 5,           // Open after 5 consecutive failures
      halfOpenAfter: 30000,   // Try again after 30 seconds
      skipStreaming: true,    // Skip streaming calls
    }),
  ],
});

await server.start();
```

```typescript
import { createConnectTransport } from '@connectrpc/connect-node';
import { createCircuitBreakerInterceptor } from '@connectum/interceptors';

const transport = createConnectTransport({
  baseUrl: 'http://localhost:5000',
  interceptors: [
    createCircuitBreakerInterceptor({ threshold: 3 }),
  ],
});
```

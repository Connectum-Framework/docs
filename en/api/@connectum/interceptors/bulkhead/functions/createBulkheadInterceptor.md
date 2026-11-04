[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [bulkhead](../index.md) / createBulkheadInterceptor

# Function: createBulkheadInterceptor()

> **createBulkheadInterceptor**(`options?`): `Interceptor`

Defined in: [bulkhead.ts:75](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/bulkhead.ts#L75)

Create bulkhead interceptor

Limits concurrent requests to prevent resource exhaustion.
Requests beyond capacity are queued. Requests beyond queue size are rejected
with `ResourceExhausted` and the text `Bulkhead capacity exceeded (capacity: N,
queueSize: M)`; branch on the code, not on the text.

Queued calls run in arrival order. A call whose request signal aborts while it
waits leaves the queue at once, frees its place and fails with `Canceled`
(the abort reason itself when it is a `ConnectError`); its handler never
runs. A call that arrives with an already aborted signal fails the same way
without taking a slot or a queue place. A slot is held until the downstream
call settles, so work that ignores its signal still counts against `capacity`.

`capacity` must be an integer of at least 1 and `queueSize` an integer of at
least 0; anything else throws at construction (`TypeError` for a non-number,
`RangeError` otherwise).

## Parameters

### options?

[`BulkheadOptions`](../../interfaces/BulkheadOptions.md) = `{}`

Bulkhead options

## Returns

`Interceptor`

ConnectRPC interceptor

## Examples

**Server-side usage with createServer**

```typescript
import { createServer } from '@connectum/core';
import { createBulkheadInterceptor } from '@connectum/interceptors';
import { myRoutes } from './routes.js';

const server = createServer({
  services: [myRoutes],
  interceptors: [
    createBulkheadInterceptor({
      capacity: 10,       // Max 10 concurrent requests
      queueSize: 10,      // Queue up to 10 pending requests
      skipStreaming: true,
    }),
  ],
});

await server.start();
```

**Client-side usage with transport**

```typescript
import { createConnectTransport } from '@connectrpc/connect-node';
import { createBulkheadInterceptor } from '@connectum/interceptors';

const transport = createConnectTransport({
  baseUrl: 'http://localhost:5000',
  httpVersion: '1.1',
  interceptors: [
    createBulkheadInterceptor({ capacity: 5, queueSize: 5 }),
  ],
});
```

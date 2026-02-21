[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [bulkhead](../index.md) / createBulkheadInterceptor

# Function: createBulkheadInterceptor()

> **createBulkheadInterceptor**(`options?`): `Interceptor`

Defined in: [bulkhead.ts:56](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/bulkhead.ts#L56)

Create bulkhead interceptor

Limits concurrent requests to prevent resource exhaustion.
Requests beyond capacity are queued. Requests beyond queue size are rejected.

## Parameters

### options?

[`BulkheadOptions`](../../interfaces/BulkheadOptions.md) = `{}`

Bulkhead options

## Returns

`Interceptor`

ConnectRPC interceptor

## Examples

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

```typescript
import { createConnectTransport } from '@connectrpc/connect-node';
import { createBulkheadInterceptor } from '@connectum/interceptors';

const transport = createConnectTransport({
  baseUrl: 'http://localhost:5000',
  interceptors: [
    createBulkheadInterceptor({ capacity: 5, queueSize: 5 }),
  ],
});
```

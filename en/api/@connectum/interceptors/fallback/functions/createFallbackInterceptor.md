[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [fallback](../index.md) / createFallbackInterceptor

# Function: createFallbackInterceptor()

> **createFallbackInterceptor**\<`T`\>(`options`): `Interceptor`

Defined in: [fallback.ts:103](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/fallback.ts#L103)

Create fallback interceptor

Provides fallback response when service fails, enabling graceful degradation.
The handler returns the RPC response message, not a response wrapper.
In the server example, getCachedData is application code that returns that message.

The response synthesised by the fallback interceptor carries only the protocol
headers it needs, on a server chain and on a client transport alike:
- `header` holds one field, `content-type`, equal to the request `content-type`
  (for a Connect GET request without one, derived from the `encoding` query
  parameter: `json` gives `application/json`, `proto` gives `application/proto`;
  the header stays empty when no type can be derived).
- `trailer` holds `grpc-status: 0` when the request `content-type` starts with
  `application/grpc` (gRPC and gRPC-web), and is empty otherwise.

No header of the request is copied into the response, whichever interceptor added
it, so the response is accepted by Connect, gRPC and gRPC-web clients over HTTP/2
and HTTP/1.1 and does not hand request headers back to the caller. Metadata the
caller needs belongs in the message the `handler` returns.

## Type Parameters

### T

`T` = `unknown`

## Parameters

### options

[`FallbackOptions`](../../interfaces/FallbackOptions.md)\<`T`\>

Fallback options

## Returns

`Interceptor`

ConnectRPC interceptor

## Examples

**Server-side usage with createServer**

```typescript
import { createServer } from '@connectum/core';
import { createFallbackInterceptor } from '@connectum/interceptors';
import { myRoutes } from './routes.js';

const server = createServer({
  services: [myRoutes],
  interceptors: [
    createFallbackInterceptor({
      handler: (error) => {
        console.error('Service failed, returning cached data:', error);
        return getCachedData();
      },
      skipStreaming: true,
    }),
  ],
});

await server.start();
```

**Client-side usage with transport**

```typescript
import { createConnectTransport } from '@connectrpc/connect-node';
import { createFallbackInterceptor } from '@connectum/interceptors';

const transport = createConnectTransport({
  baseUrl: 'http://localhost:5000',
  httpVersion: '1.1',
  interceptors: [
    createFallbackInterceptor({
      handler: () => ({ data: [] }),
    }),
  ],
});
```

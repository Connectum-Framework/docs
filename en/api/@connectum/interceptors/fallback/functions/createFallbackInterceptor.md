[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [fallback](../index.md) / createFallbackInterceptor

# Function: createFallbackInterceptor()

> **createFallbackInterceptor**\<`T`\>(`options`): `Interceptor`

Defined in: [fallback.ts:197](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/fallback.ts#L197)

Create fallback interceptor

Provides fallback response when service fails, enabling graceful degradation.
The handler returns the RPC response message, not a response wrapper. It may return a
message created for the method's output type (`create(OutputSchema, { ... })`), or a plain
object with that message's fields, which the interceptor turns into one. A value that is
neither (`undefined`, `null`, a string) fails the call with a `TypeError` that names this
interceptor and the expected type. A plain object is checked field by field first: a key that
is not a field, a value of another kind than its field takes (a number in a string field, a
non-boolean in a bool field, a non-array in a repeated field) and a number the encoder cannot
write fail the same way, with the path of the problem; so do a map key that is not in the canonical
form of its key type, a non-canonical string for a 64-bit integer, a lone surrogate and bytes that are
not a `Uint8Array` or an array of integers 0 to 255. A oneof is set as `{ case, value }`
under the oneof's name. Behind the error handler the client sees `Internal: internal error`.
In the server example, getCachedData is application code that returns that message.

A refusal of access is never replaced: a failure with the code `Unauthenticated` or
`PermissionDenied` is rethrown as it is, and the `handler` is not called for it. The
fallback value is for failed dependencies, timeouts and bugs, not for callers who are
not allowed. Even so, put the authentication and authorization interceptors in front of
the default interceptors, as the authentication guide shows.

A request rejected by validation is a client error, not a failed dependency, so the
validation interceptor must stand outside this one. `createDefaultInterceptors` does so;
when you compose the chain yourself, put validation before the fallback, or an invalid
request is answered with the fallback value as if it had been served.

The retry and circuit breaker interceptors must stand inside this one. They act on the
errors that leave the layers below them; a fallback placed inside them answers the first
failure with a value, so no retry runs and the breaker never records a failure. With the
fallback outside, the `handler` is asked once the retries are exhausted, or when the open
breaker has refused the call, and it receives the error that ended the call: the last failure
for a code retry repeats, the first one for a code it does not. `createDefaultInterceptors`
orders them so (validation, fallback, circuitBreaker, retry). When you compose the chain
yourself, list the fallback before `createCircuitBreakerInterceptor` and
`createRetryInterceptor`.

Consequences of that order. The error a retry raises after the caller cancelled or the deadline
passed (`Canceled`, `DeadlineExceeded`) also reaches the `handler`; the client still gets the
cancellation or deadline from the layer that raised it, but side effects of the `handler`
(metrics, logs) run for such calls. An error thrown by the `handler` itself is not retried and
is not counted by the breaker; it goes straight to the error handler. With the breaker open,
a request that breaks a validation rule gets `InvalidArgument` when a fallback is enabled
(validation stands outside), while without a fallback the open breaker answers it first with
`Unavailable`.

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

Streaming calls are skipped by default. With `skipStreaming: false` the fallback covers a
streaming call whose opening fails: the `handler`'s message is then the only message of
the call (the single response of a client-streaming call). A failure after the response
has opened, while its messages are being read, is not replaced.

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
import { create } from '@bufbuild/protobuf';
import { createConnectTransport } from '@connectrpc/connect-node';
import { createFallbackInterceptor } from '@connectum/interceptors';
import { ListItemsResponseSchema } from './gen/items_pb.js';

const transport = createConnectTransport({
  baseUrl: 'http://localhost:5000',
  httpVersion: '1.1',
  interceptors: [
    createFallbackInterceptor({
      // A message made with create(), or a plain object with the fields of the response message
      handler: () => create(ListItemsResponseSchema, { items: [] }),
    }),
  ],
});
```

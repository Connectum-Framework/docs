[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [errorHandler](../index.md) / createErrorHandlerInterceptor

# Function: createErrorHandlerInterceptor()

> **createErrorHandlerInterceptor**(`options?`): `Interceptor`

Defined in: [errorHandler.ts:149](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/errorHandler.ts#L149)

Create error handler interceptor

Catches rejections from awaiting next(req) and transforms them into
ConnectError instances with proper error codes. Recognizes SanitizableError for safe
client-facing messages while preserving server details for logging.

What a client receives for each kind of thrown value:
- `ConnectError`: passes through unchanged, text and details included. Its author
  chose to send them.
- `SanitizableError`: its `clientMessage` and code only; `serverDetails` stay on the server.
  A `code` that is not an integer from 1 to 16 is sent as `Internal`, as for any other failure.
- An `Error` named `AbortError` or `TimeoutError` (a `DOMException` from an aborted
  `fetch` or `AbortSignal.timeout()` too): `Canceled`, whatever its numeric `code`. A
  `SanitizableError` is recognised before this check.
- Anything else (`Error`, a thrown string, an object with a numeric `code`): the code is
  the numeric `code` when it is an integer from 1 to 16 (a Connect failure code) and
  `Internal` otherwise (no code, a non-number, or a number outside 1..16).

The text of a failure in the last two groups is NOT sent: `Internal` carries the fixed text
`"internal error"`, any other code (`Canceled` included) carries an empty text. A message such as a
connection string or a query would otherwise leak to every caller (CWE-209). Set
`exposeErrorMessages: true` to send the original text; the codes stay the same.

The original failure always stays on the server: as `cause` of the thrown ConnectError
(no transport serializes `cause`), in `onError` as `info.error` with its original text,
and in the console log.

`onError` is a reporting hook and cannot change the outcome of a call: if it throws or
returns a rejected promise, the client still receives the error described above and the
process sees no unhandled rejection. The first failure of the callback is written once to
`console.error`; later ones are dropped.

Place this interceptor first to normalize rejections from downstream interceptors.
It does not wrap response-stream iteration after next(req) returns, or errors
from request gates that run before the interceptor chain.

## Parameters

### options?

[`ErrorHandlerOptions`](../../interfaces/ErrorHandlerOptions.md) = `{}`

Error handler options

## Returns

`Interceptor`

ConnectRPC interceptor

## Example

**Server-side usage with createServer**

```typescript
import { createServer } from '@connectum/core';
import { createErrorHandlerInterceptor } from '@connectum/interceptors';
import { myRoutes } from './routes.js';

const server = createServer({
  services: [myRoutes],
  interceptors: [
    createErrorHandlerInterceptor({
      onError: ({ error, code, serverDetails, stack }) => {
        logger.error('RPC error', { error: error.message, code, serverDetails, stack });
      },
    }),
  ],
});

await server.start();
```

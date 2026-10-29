[Connectum API Reference](../../../../index.md) / [@connectum/interceptors](../../index.md) / [errorHandler](../index.md) / createErrorHandlerInterceptor

# Function: createErrorHandlerInterceptor()

> **createErrorHandlerInterceptor**(`options?`): `Interceptor`

Defined in: [errorHandler.ts:90](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/errorHandler.ts#L90)

Create error handler interceptor

Catches rejections from awaiting next(req) and transforms them into
ConnectError instances with proper error codes. Recognizes SanitizableError for safe
client-facing messages while preserving server details for logging.

What a client receives for each kind of thrown value:
- `ConnectError`: passes through unchanged, text and details included. Its author
  chose to send them.
- `SanitizableError`: its `clientMessage` and code only; `serverDetails` stay on the server.
- Other `Error` instances named `AbortError` or `TimeoutError`: Connect-ES maps them
  to `Canceled`. Remaining failures use a numeric `code` when it is an integer from
  1 to 16 (a Connect failure code), or `Internal` otherwise. With message hiding,
  `Internal` carries `"internal error"` (including numeric `13`); other codes carry
  an empty text. A connection string or query would otherwise leak to every caller
  (CWE-209). Set `exposeErrorMessages: true` to expose the text of these other failures.

With the default message hiding, a non-Connect, non-Sanitizable failure is retained
as `cause` of the normalized error; transports do not serialize it. A ConnectError
is unchanged. Converting a SanitizableError does not attach the original as cause.
If supplied, `onError` receives the original SanitizableError or the server-side
ConnectError.from() result for other failures. Console logging runs only without
`onError` and with `logErrors` enabled (by default, outside production).

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

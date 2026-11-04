---
title: Error handling interceptor
description: Normalize thrown failures and keep server-only details out of client error messages.
docType: how-to
outline: deep
---

# Error handling interceptor

`errorHandler` is enabled by default and wraps the rest of the default chain.
It catches failures thrown or rejected by `next(req)`. It does not wrap later
response-stream iteration or request gates that run before the chain.

## Configure

```typescript
import { createErrorHandlerInterceptor } from '@connectum/interceptors';

const errors = createErrorHandlerInterceptor({
  exposeErrorMessages: false,
  logErrors: true,
});
```

Place `errors` first in a manually assembled chain, or configure the `errorHandler`
key of `createDefaultInterceptors()`. Ordinary failures can contain connection
strings, queries or request values; keep them server-side unless deliberately
exposed.

## What the client receives

The behavior is the same over gRPC, Connect and the in-process client:

| Thrown by the handler | Client receives |
|---|---|
| `ConnectError` | Unchanged code, text, details and metadata |
| `SanitizableError` | Its `clientMessage` and code (`Internal` if the code is not an integer from 1 to 16); `serverDetails` stay on the server |
| An `Error` named `AbortError` or `TimeoutError`, including `DOMException`, whatever its `code` | `Canceled` with empty text |
| Any other value with an integer `code` from 1 to 16 | That code; `Internal` (13) has `internal error`, other codes have empty text |
| Anything else: an ordinary error, a thrown string, or an invalid `code` | `Internal` with `internal error` |

Only integers from 1 (`Canceled`) to 16 (`Unauthenticated`) are accepted. Zero
means gRPC success, not a failure. Values such as `17`, `1.5`, `NaN`, HTTP status
codes and errno values become `Internal`.

Rows are checked in this order. A `SanitizableError` named `AbortError` still
keeps its client message and normalized code. `exposeErrorMessages: true`
changes only the text from the third row onward, not their codes; the first two
rows remain unchanged. `onError` receives the code sent to the client, while
the original error keeps its own `code`.

With `exposeErrorMessages: false`, a non-Connect, non-Sanitizable failure is
retained as the normalized error's `cause`; transports do not serialize it.
Converting a `SanitizableError` does not attach the original error as `cause`.

## Logging and intentional client messages

`onError`, when supplied, receives the original `SanitizableError` including its
server details, or the server-side `ConnectError.from()` result for other
failures. Console logging runs only without `onError` and with `logErrors`
enabled. `logErrors` defaults to `process.env.NODE_ENV !== "production"`.

Console logging writes the failure once with its stack and cause. A second
line, `Transformed ConnectError:`, appears only when the client receives
something different, as short text such as `[internal] internal error`.
An unchanged `ConnectError` produces one entry. `includeStackTrace` controls
the stack field supplied to `onError`.

`onError` is a reporting hook and cannot change the call's outcome. It may be
async; the interceptor does not await it. A thrown error or rejected promise
does not replace the client error or produce an unhandled rejection. The first
callback failure is reported once to `console.error`; later failures are dropped.

Throw a `ConnectError` or `SanitizableError` to send an intentional client
message. `exposeErrorMessages: true` also exposes ordinary failures; its default
is `false` independently of `NODE_ENV`. Restrict that setting to trusted
internal callers or debugging. Client logic should branch on error codes and
structured details rather than parsing messages.

For a thrown value that is not an `Error`, exposing the original text uses its
string form.

See [ErrorHandlerOptions](/en/api/@connectum/interceptors/interfaces/ErrorHandlerOptions)
and the [migration guide](/en/migration/error-handler-messages).

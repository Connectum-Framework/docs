---
title: Interceptors
description: Choose and compose Connectum middleware without duplicating exact option reference.
docType: concept
outline: deep
---

# Interceptors

Interceptors wrap RPC execution with cross-cutting behavior while handlers stay focused on business logic. Their order is observable: a request moves from the first interceptor toward the handler and the response unwinds in reverse.

## Start with the default chain

```typescript
import { createDefaultInterceptors } from '@connectum/interceptors';

const interceptors = createDefaultInterceptors({
  timeout: { duration: 10_000 },
  retry: { maxRetries: 2 },
});
```

Error handling and validation are structural defaults. Timeout, bulkhead, circuit breaker, retry, fallback, and serializer behavior is opt-in because it changes request semantics. The canonical chain order, defaults, and standalone factories live in [Built-in interceptors](/en/guide/interceptors/built-in); exact fields live in [`DefaultInterceptorOptions`](/en/api/@connectum/interceptors/defaults/interfaces/DefaultInterceptorOptions).

## Choose the extension route

| Need | Route |
|---|---|
| Configure the supported chain | [Built-in interceptors](/en/guide/interceptors/built-in) |
| Add business-specific middleware | [Custom interceptors](/en/guide/interceptors/custom) |
| Apply behavior to selected services or methods | [Method filtering](/en/guide/interceptors/method-filtering) |
| Authenticate or authorize calls | [Auth and authz](/en/guide/auth) |
| Trace incoming or outgoing calls | [Tracing](/en/guide/observability/tracing) |
| Look up an exact factory or option | [`@connectum/interceptors` API](/en/api/@connectum/interceptors/) |

Use native router scoping when an interceptor belongs to one service, a method-filter interceptor for declarative name patterns, and a custom interceptor only when selection depends on runtime request data.

## Module route

The [`@connectum/interceptors` module hub](/en/packages/interceptors) owns installation, the minimal example, key entry points, and Learn / Configure / API navigation.

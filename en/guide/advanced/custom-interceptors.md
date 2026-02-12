---
title: Creating Custom Interceptors
description: How to create, compose, and test custom ConnectRPC interceptors with the Connectum framework.
---

# Creating Custom Interceptors

Connectum's interceptor system is built on top of the standard ConnectRPC `Interceptor` interface. You can create custom interceptors to add authentication, rate limiting, caching, or any cross-cutting concern to your services.

## The Interceptor Interface

A ConnectRPC interceptor is a function that receives a `next` handler and returns a new handler. The returned handler receives the request, can modify it, call `next`, and modify the response:

```typescript
import type { Interceptor } from '@connectrpc/connect';

const myInterceptor: Interceptor = (next) => async (req) => {
  // Before the request reaches the service handler
  console.log(`Incoming: ${req.service.typeName}/${req.method.name}`);

  const response = await next(req);

  // After the service handler returns
  console.log('Response received');
  return response;
};
```

## Factory Pattern

Connectum follows the factory pattern for all interceptors -- a function that accepts an options object and returns an `Interceptor`. This is the recommended approach for reusable interceptors:

```typescript
import type { Interceptor } from '@connectrpc/connect';

interface AuthInterceptorOptions {
  /** Header name to read the token from */
  headerName?: string;
  /** Function to validate the token */
  validateToken: (token: string) => Promise<boolean>;
}

function createAuthInterceptor(options: AuthInterceptorOptions): Interceptor {
  const { headerName = 'authorization', validateToken } = options;

  return (next) => async (req) => {
    const token = req.header.get(headerName);

    if (!token) {
      throw new ConnectError('Missing authentication token', Code.Unauthenticated);
    }

    const isValid = await validateToken(token);
    if (!isValid) {
      throw new ConnectError('Invalid authentication token', Code.Unauthenticated);
    }

    return next(req);
  };
}
```

::: tip
The `InterceptorFactory` type from `@connectum/interceptors` can enforce this pattern:

```typescript
import type { InterceptorFactory } from '@connectum/interceptors';

const createAuthInterceptor: InterceptorFactory<AuthInterceptorOptions> = (options) => {
  // ...returns Interceptor
};
```
:::

## Accessing Request Metadata

Inside an interceptor you have access to the full request context:

```typescript
const inspector: Interceptor = (next) => async (req) => {
  // Service and method information
  const serviceName = req.service.typeName;   // e.g. "user.v1.UserService"
  const methodName = req.method.name;          // e.g. "GetUser"
  const methodKind = req.method.kind;          // "unary", "server_streaming", etc.

  // Request headers
  const contentType = req.header.get('content-type');
  const customHeader = req.header.get('x-request-id');

  // Request message (unary only)
  if (req.stream === false) {
    console.log('Request payload:', req.message);
  }

  const response = await next(req);

  // Response headers and trailers
  response.header.set('x-served-by', 'connectum');

  return response;
};
```

## Error Handling Within Interceptors

Always use `ConnectError` from `@connectrpc/connect` to return proper gRPC status codes:

```typescript
import { Code, ConnectError } from '@connectrpc/connect';
import type { Interceptor } from '@connectrpc/connect';

function createRateLimitInterceptor(options: {
  maxRequests: number;
  windowMs: number;
}): Interceptor {
  const { maxRequests, windowMs } = options;
  const counters = new Map<string, { count: number; resetAt: number }>();

  return (next) => async (req) => {
    const key = req.service.typeName;
    const now = Date.now();
    let entry = counters.get(key);

    if (!entry || now >= entry.resetAt) {
      entry = { count: 0, resetAt: now + windowMs };
      counters.set(key, entry);
    }

    entry.count++;

    if (entry.count > maxRequests) {
      throw new ConnectError(
        `Rate limit exceeded: ${maxRequests} requests per ${windowMs}ms`,
        Code.ResourceExhausted,
      );
    }

    return next(req);
  };
}
```

::: warning
When the built-in `errorHandler` interceptor is active (enabled by default), it will catch any uncaught errors from your interceptors and normalize them to `ConnectError`. If you throw a `ConnectError`, its code is preserved. Non-`ConnectError` exceptions are mapped to `Code.Internal`.
:::

## Composing with Built-in Interceptors

Use `createDefaultInterceptors()` to build the default chain, then append your custom interceptors:

```typescript
import { createServer } from '@connectum/core';
import { createDefaultInterceptors } from '@connectum/interceptors';

const server = createServer({
  services: [routes],
  port: 5000,
  interceptors: [
    // Built-in chain: errorHandler -> timeout -> bulkhead -> circuitBreaker -> retry -> fallback -> validation -> serializer
    ...createDefaultInterceptors({ timeout: { duration: 10_000 } }),

    // Custom interceptors run after builtins
    createAuthInterceptor({ validateToken: verifyJwt }),
    createRateLimitInterceptor({ maxRequests: 100, windowMs: 60_000 }),
  ],
});
```

To replace the built-in chain entirely, provide only your own interceptors:

```typescript
import {
  createErrorHandlerInterceptor,
  createTimeoutInterceptor,
  createSerializerInterceptor,
} from '@connectum/interceptors';

const server = createServer({
  services: [routes],
  interceptors: [
    createErrorHandlerInterceptor({ logErrors: true }),
    createAuthInterceptor({ validateToken: verifyJwt }),
    createTimeoutInterceptor({ duration: 5_000 }),
    createSerializerInterceptor(),
  ],
});
```

## Example: Audit Log Interceptor

```typescript
import type { Interceptor } from '@connectrpc/connect';

function createAuditLogInterceptor(options: {
  logger?: (entry: Record<string, unknown>) => void;
} = {}): Interceptor {
  const { logger = (e) => console.log('[audit]', JSON.stringify(e)) } = options;

  return (next) => async (req) => {
    const start = performance.now();
    try {
      const response = await next(req);
      logger({ service: req.service.typeName, method: req.method.name, success: true,
               durationMs: Math.round(performance.now() - start) });
      return response;
    } catch (error) {
      logger({ service: req.service.typeName, method: req.method.name, success: false,
               durationMs: Math.round(performance.now() - start) });
      throw error;
    }
  };
}
```

## Testing Custom Interceptors

Use `node:test`. Create a mock `next` function and invoke the interceptor directly:

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ConnectError, Code } from '@connectrpc/connect';

describe('createAuthInterceptor', () => {
  const interceptor = createAuthInterceptor({
    validateToken: async (token) => token === 'valid-token',
  });
  const mockReq = (headers: Record<string, string>) => ({
    header: new Headers(headers),
    service: { typeName: 'test.v1.TestService' },
    method: { name: 'Test', kind: 'unary' },
    stream: false,
  });
  const mockNext = async () => ({ header: new Headers(), trailer: new Headers() });

  it('should pass with valid token', async () => {
    const handler = interceptor(mockNext);
    const response = await handler(mockReq({ authorization: 'valid-token' }));
    assert.ok(response);
  });

  it('should reject missing token', async () => {
    const handler = interceptor(mockNext);
    await assert.rejects(() => handler(mockReq({})), (err) => {
      assert.ok(err instanceof ConnectError);
      assert.strictEqual(err.code, Code.Unauthenticated);
      return true;
    });
  });
});
```

## Related

- [Method Filtering](./method-filtering.md) -- Apply interceptors to specific services/methods
- [Configuration](./configuration.md) -- Environment-based configuration
- [Custom Protocols](./custom-protocols.md) -- Creating protocol plugins

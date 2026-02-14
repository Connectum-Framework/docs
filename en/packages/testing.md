---
title: '@connectum/testing'
description: Testing utilities for Connectum services
---

# @connectum/testing

Testing utilities for Connectum gRPC/ConnectRPC services.

**Layer**: 3 (Development Tools)

**Status**: Planned -- this package is currently a placeholder with no implementation.

## Installation

```bash
pnpm add -D @connectum/testing
```

> **Note**: This package is marked as `private: true` in its `package.json` and is not published to npm yet.

## Current State

The package source (`src/index.ts`) contains only a TODO comment:

```typescript
// @connectum/testing - TODO: Implement
```

No utilities, helpers, or test fixtures are currently available.

## Planned Features

Based on the package's position in the Connectum architecture (Layer 3, depends on `@connectum/core` and `@connectrpc/connect`), the following features are planned:

- **Test server factory** -- Spin up an in-process Connectum server for integration tests with automatic port assignment and cleanup
- **ConnectRPC test client** -- Pre-configured client for calling test servers
- **Mock interceptors** -- Tools for testing interceptor behavior in isolation
- **Health check assertions** -- Helpers for verifying health check state
- **Snapshot testing** -- Proto message comparison utilities

## Testing Without This Package

Until `@connectum/testing` is implemented, use these approaches:

### Integration Tests with `createServer()`

```typescript
import { describe, it, after } from 'node:test';
import assert from 'node:assert';
import { createServer } from '@connectum/core';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { createClient } from '@connectrpc/connect';
import { MyService } from '#gen/my_service_pb.js';
import routes from '#gen/routes.js';

describe('MyService', () => {
  const server = createServer({
    services: [routes],
    port: 0, // random port
    interceptors: [], // minimal setup for tests, no default interceptors
  });

  after(async () => {
    if (server.isRunning) await server.stop();
  });

  it('should handle GetUser', async () => {
    await server.start();
    const port = server.address?.port;

    const transport = createGrpcTransport({
      baseUrl: `http://localhost:${port}`,
    });
    const client = createClient(MyService, transport);

    const response = await client.getUser({ id: '123' });
    assert.strictEqual(response.name, 'Test User');
  });
});
```

### Unit Tests for Interceptors

```typescript
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { createTimeoutInterceptor } from '@connectum/interceptors';

describe('timeout interceptor', () => {
  it('should pass through fast requests', async () => {
    const interceptor = createTimeoutInterceptor({ duration: 5000 });

    // Create a mock next function
    const next = async (req) => ({
      stream: false,
      message: { result: 'ok' },
      header: new Headers(),
      trailer: new Headers(),
    });

    const handler = interceptor(next);
    const response = await handler(mockRequest);
    assert.strictEqual(response.message.result, 'ok');
  });
});
```

### Testing with Isolated HealthcheckManager

```typescript
import { createHealthcheckManager, ServingStatus } from '@connectum/healthcheck';

const manager = createHealthcheckManager();
// Use `manager` instead of the global singleton for test isolation
```

## Dependencies

| Package | Purpose |
|---------|---------|
| `@connectum/core` | Server creation for integration tests |
| `@connectrpc/connect` | ConnectRPC client and types |

## Related Packages

- **[@connectum/core](./core.md)** -- Server used in integration tests
- **[@connectum/interceptors](./interceptors.md)** -- Interceptors to test
- **[@connectum/healthcheck](./healthcheck.md)** -- `createHealthcheckManager()` for test isolation

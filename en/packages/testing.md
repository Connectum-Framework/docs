---
title: '@connectum/testing'
description: Testing utilities for ConnectRPC interceptors and services
---

# @connectum/testing

Testing utilities for the Connectum framework. Provides mock factories, assertion helpers, and a test server utility to eliminate boilerplate in ConnectRPC interceptor and service tests.

**Layer**: 2 (Testing Utilities)

::: tip Related Guides
- [Testing](/en/guide/testing) -- testing strategies and tools
- [Custom Interceptors](/en/guide/interceptors/custom) -- writing interceptors to test
:::

::: tip Full API Reference
Complete TypeScript API documentation: [API Reference](/en/api/@connectum/testing/)
:::

## Installation

```bash
pnpm add -D @connectum/testing
```

**Requires**: Node.js 18+

**Peer dependencies**: `@connectrpc/connect`, `@bufbuild/protobuf`

## Quick Start

A typical interceptor unit test using @connectum/testing utilities:

```typescript
import assert from 'node:assert';
import { describe, it } from 'node:test';
import { Code } from '@connectrpc/connect';
import {
  createMockRequest,
  createMockNext,
  createMockNextError,
  assertConnectError,
} from '@connectum/testing';
import { createTimeoutInterceptor } from '@connectum/interceptors';

describe('timeout interceptor', () => {
  const interceptor = createTimeoutInterceptor({ duration: 100 });

  it('should pass through fast responses', async () => {
    const req = createMockRequest();
    const next = createMockNext({ message: { value: 42 } });

    const handler = interceptor(next);
    const res = await handler(req);

    assert.strictEqual(next.mock.calls.length, 1);
    assert.deepStrictEqual(res.message, { value: 42 });
  });

  it('should abort slow responses', async () => {
    const req = createMockRequest();
    const next = createMockNextSlow(500);

    const handler = interceptor(next);

    await assert.rejects(() => handler(req), (err: unknown) => {
      assertConnectError(err, Code.DeadlineExceeded);
      return true;
    });
  });
});
```

## API Reference

### Mock Request

#### `createMockRequest(options?)`

Creates a mock ConnectRPC `UnaryRequest` for testing interceptors.

```typescript
function createMockRequest(options?: MockRequestOptions): UnaryRequest;
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `service` | `string` | `'test.TestService'` | Service type name |
| `method` | `string` | `'TestMethod'` | Method name |
| `message` | `unknown` | `{}` | Request message payload |
| `stream` | `boolean` | `false` | Streaming request flag |
| `url` | `string` | Auto-generated | Request URL |
| `headers` | `Headers` | `new Headers()` | Request headers |

```typescript
// Minimal -- all defaults
const req = createMockRequest();

// Custom service and message
const req = createMockRequest({
  service: 'myapp.UserService',
  method: 'GetUser',
  message: { id: '123' },
});
```

### Mock Next Functions

#### `createMockNext(options?)`

Creates a mock `next` handler returning a successful response. Returns a `mock.fn()` spy from `node:test`.

```typescript
function createMockNext(options?: MockNextOptions): MockFunction;
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `message` | `unknown` | `{ result: 'success' }` | Response message |
| `stream` | `boolean` | `false` | Streaming response flag |

#### `createMockNextError(code, message?)`

Creates a mock `next` handler that throws a `ConnectError`.

```typescript
function createMockNextError(code: Code, message?: string): MockFunction;
```

```typescript
const next = createMockNextError(Code.NotFound, 'User not found');
```

#### `createMockNextSlow(delay, options?)`

Creates a mock `next` handler that responds after a delay. Useful for timeout testing.

```typescript
function createMockNextSlow(delay: number, options?: MockNextOptions): MockFunction;
```

```typescript
const next = createMockNextSlow(200); // resolves after ~200ms
```

### Assertions

#### `assertConnectError(error, expectedCode, messagePattern?)`

Type-safe assertion that narrows `error` to `ConnectError`. Checks the gRPC status code and optionally matches the message against a string or RegExp.

```typescript
function assertConnectError(
  error: unknown,
  expectedCode: Code,
  messagePattern?: string | RegExp,
): asserts error is ConnectError;
```

```typescript
await assert.rejects(() => handler(req, next), (err: unknown) => {
  assertConnectError(err, Code.InvalidArgument, /validation failed/i);
  return true;
});
```

### Protobuf Descriptor Mocks

#### `createMockDescMessage(typeName, options?)`

Creates a mock `DescMessage` with all required structural properties for protobuf utilities.

```typescript
function createMockDescMessage(
  typeName: string,
  options?: MockDescMessageOptions,
): DescMessage;
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `fields` | `Array<{ name, type?, fieldNumber? }>` | `[]` | Field definitions |
| `oneofs` | `string[]` | `[]` | Oneof group names |

```typescript
const schema = createMockDescMessage('test.UserMessage', {
  fields: [
    { name: 'id', type: 'int32' },
    { name: 'email', type: 'string' },
  ],
});
```

#### `createMockDescField(localName, options?)`

Creates a mock `DescField` descriptor.

```typescript
function createMockDescField(
  localName: string,
  options?: MockDescFieldOptions,
): DescField;
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `isSensitive` | `boolean` | `false` | Mark field as sensitive (for redact interceptor) |
| `fieldNumber` | `number` | Auto-incremented | Proto field number |
| `type` | `string` | `'string'` | Field scalar type |

#### `createMockDescMethod(name, options?)`

Creates a mock `DescMethod` descriptor. Auto-generates input/output message descriptors based on the method name.

```typescript
function createMockDescMethod(
  name: string,
  options?: MockDescMethodOptions,
): DescMethod;
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `input` | `DescMessage` | Auto-generated | Input message descriptor |
| `output` | `DescMessage` | Auto-generated | Output message descriptor |
| `kind` | `string` | `'unary'` | Method kind (`unary`, `server_streaming`, `client_streaming`, `bidi_streaming`) |
| `useSensitiveRedaction` | `boolean` | `false` | Enable sensitive field redaction |

### Fake Service Descriptors

#### `createFakeService(options?)`

Creates a fake `DescService` descriptor for testing interceptors and utilities.

```typescript
function createFakeService(options?: FakeServiceOptions): DescService;
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `typeName` | `string` | `'test.v1.TestService'` | Service type name |
| `name` | `string` | Derived from typeName | Service short name |

#### `createFakeMethod(service, name, options?)`

Creates a fake `DescMethod` attached to a service. Use `register: true` to add it to the service's method list.

```typescript
function createFakeMethod(
  service: DescService,
  name: string,
  options?: FakeMethodOptions,
): DescMethod;
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `methodKind` | `string` | `'unary'` | Method kind |
| `register` | `boolean` | `false` | Register method in service.methods |

```typescript
const svc = createFakeService();
const method = createFakeMethod(svc, 'GetUser', { register: true });
// svc.methods.length === 1
```

### Streaming

#### `createMockStream(items, options?)`

Creates a reusable `AsyncIterable` that yields items sequentially.

```typescript
function createMockStream<T>(
  items: T[],
  options?: MockStreamOptions,
): AsyncIterable<T>;
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `delayMs` | `number` | — | Delay between yielded items (ms) |

```typescript
const stream = createMockStream([{ id: '1' }, { id: '2' }]);
const slow = createMockStream([{ id: '1' }], { delayMs: 100 });
```

### Test Server

#### `createTestServer(options)`

Starts a real ConnectRPC server on a random port for integration testing. Returns a `TestServer` with a pre-configured gRPC transport.

```typescript
function createTestServer(
  options: CreateTestServerOptions,
): Promise<TestServer>;
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `services` | `unknown[]` | — | ConnectRPC service route handlers (required) |
| `interceptors` | `unknown[]` | `[]` | Interceptors to apply |
| `protocols` | `unknown[]` | `[]` | Protocol extensions (Healthcheck, Reflection) |
| `port` | `number` | `0` | Port number (0 = random) |

**TestServer interface:**

```typescript
interface TestServer {
  transport: Transport;  // Pre-configured client transport
  baseUrl: string;       // e.g. 'http://localhost:54321'
  port: number;          // Assigned port number
  close(): Promise<void>; // Stop server and close connections
}
```

```typescript
const server = await createTestServer({
  services: [myRoutes],
  interceptors: [createValidationInterceptor()],
});

const client = createClient(MyService, server.transport);
const response = await client.getUser({ id: '123' });

await server.close();
```

#### `withTestServer(options, testFn)`

Convenience wrapper that manages server lifecycle automatically -- starts before the test, closes after (even on error).

```typescript
function withTestServer<T>(
  options: CreateTestServerOptions,
  testFn: (server: TestServer) => Promise<T>,
): Promise<T>;
```

```typescript
it('should respond to requests', async () => {
  await withTestServer({ services: [myRoutes] }, async (server) => {
    const client = createClient(MyService, server.transport);
    const res = await client.getUser({ id: '1' });
    assert.strictEqual(res.name, 'Test User');
  });
});
```

## Exports Summary

| Export | Category | Description |
|--------|----------|-------------|
| `createMockRequest` | Mock Request | Mock ConnectRPC unary request |
| `createMockNext` | Mock Next | Successful response handler spy |
| `createMockNextError` | Mock Next | Error-throwing handler spy |
| `createMockNextSlow` | Mock Next | Delayed response handler spy |
| `assertConnectError` | Assertions | Type-safe ConnectError assertion |
| `createMockDescMessage` | Protobuf Mocks | Mock message descriptor |
| `createMockDescField` | Protobuf Mocks | Mock field descriptor |
| `createMockDescMethod` | Protobuf Mocks | Mock method descriptor |
| `createFakeService` | Fake Descriptors | Fake service descriptor |
| `createFakeMethod` | Fake Descriptors | Fake method descriptor |
| `createMockStream` | Streaming | Mock async iterable stream |
| `createTestServer` | Test Server | Start real test server |
| `withTestServer` | Test Server | Auto-managed test server |

## Related Packages

- [@connectum/core](/en/packages/core) -- server foundation used by `createTestServer`
- [@connectum/interceptors](/en/packages/interceptors) -- interceptors commonly tested with these utilities
- [@connectum/auth](/en/packages/auth) -- auth interceptors testable with mock request/next

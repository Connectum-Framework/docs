---
title: Testing Helper Changes
description: From 1.3.0, createTestServer listens on loopback and checks its options, InMemoryMetricCollector.flush() returns only new data, and the default parity comparison ignores protocol headers and measured durations.
docType: migration
---

# Testing Helper Changes

> Applies to 1.3.0.

## Does this apply to you?

You need to act if your tests do one of the following.

| You | What changed | Action |
|---|---|---|
| Reach a `createTestServer()` or `withTestServer()` server from another container or host | The server listens on `127.0.0.1` instead of all interfaces. `baseUrl` is still `http://localhost:<port>`. | Pass `host: '0.0.0.0'`. |
| Set `LISTEN` to move the test server | The helper always passes a host, so `LISTEN` no longer applies to it. | Pass `host`. |
| Pass `services`, `interceptors` or `protocols` to `createTestServer()` as `unknown[]` | They are typed `ServiceDefinition[]`, `Interceptor[]` and `ProtocolRegistration[]`. A value of another type no longer compiles. | Type the lists, or build them from `defineService()` and the interceptor factories. |
| Pass something that is not a service, an interceptor or a protocol in untyped code | The call rejects before a server starts, with a `TypeError` that names the option and the index, such as `createTestServer: services[0] must be a service definition returned by defineService() or defineLazyService(), got the string "not-a-service".` Before, a bad service failed from inside `createServer()`, and a bad interceptor was accepted and a server started anyway. | Pass service definitions, interceptor functions and protocol registrations. |
| Call `InMemoryMetricCollector.flush()` more than once and read earlier exports from the later result | `flush()` returns only what was recorded since the previous flush; before it returned every earlier export again. | Keep the earlier results yourself. |
| Call `flush()` after `dispose()` | It throws `InMemoryMetricCollector: flush() called after dispose()`; before it returned the old entries. | Flush before disposing. |

Valid values behave as before: a test that serves its own process needs no change.

## Behavior that changed without an error

- **Parity comparison.** The default comparison of `transportParityTest` ignores protocol headers in response headers, trailers and `ConnectError` metadata (`content-type`, `content-length`, `content-encoding`, `accept-encoding`, `date`, `te`, `grpc-*`, `connect-*`), and compares a time-measuring histogram by its observation count instead of its sum, minimum, maximum and buckets. Scenarios that failed on these now pass. A scenario that must compare a protocol header literally passes its own `compare`.
- **Failing mocks.** An exception thrown by a `mockService` implementation that is not a `ConnectError` now arrives with code `Internal`, its own message and itself as `cause`. Before, the caller got `[internal] internal error`. A test that asserted that text must assert the code instead.
- **Mock context.** `createMockContext` accepts `method` and `signal`. Without them it still describes the first method of the first service of the catalog.

## Required changes

```typescript
// before: reached from another container
const server = await createTestServer({ services: [routes] });

// after
const server = await createTestServer({ services: [routes], host: '0.0.0.0' });
```

To bound a `close()` that waits for a handler that never finishes, pass `shutdown: { timeout: 1000 }`; the default stays 30 s.

## Verify

Run the tests. A refused value throws on the first `createTestServer()` call with the option's name in the message. To see that the server is loopback-only, connect to the machine's non-loopback address on `server.port`: the connection is refused.

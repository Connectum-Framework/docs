---
title: Testing
description: Choose the smallest Connectum testing layer that proves the behavior you changed.
docType: concept
outline: deep
---

# Testing

Connectum supports two complementary testing layers. Use TypeScript tests for fast handler and transport feedback, then scenario tests for the deployed protocol boundary.

## Choose a layer

| Question | Recommended surface |
|---|---|
| Does a handler or interceptor return the expected value/error? | [`@connectum/testing`](/en/packages/testing) with an in-process server/client |
| Do service-catalog calls resolve without a network listener? | [In-process transport](/en/guide/production/in-process-transport) |
| Does a running service expose correct gRPC, Connect, health, auth, TLS, or streaming behavior? | [runn](/en/guide/testing/runn) |
| Do you need Go plugins or JUnit-oriented scenario output? | [scenarigo](/en/guide/testing/scenarigo) |

## Recommended path

1. Test handler and middleware decisions in process.
2. Start the real service with its generated proto contract.
3. Exercise one successful call and the important failure paths through `runn`.
4. Add deployment-specific probe or TLS scenarios only where that boundary matters.

Scenario tests catch serialization, validation, interceptor-order, reflection, and health-endpoint integration that isolated unit tests cannot. They should not repeat every business-rule case already covered in TypeScript.

## Test server {#test-server}

`createTestServer` and `withTestServer` take `services`, `interceptors` and `protocols` typed as `ServiceDefinition[]`, `Interceptor[]` and `ProtocolRegistration[]`. A value of another type is a compile error; in untyped code the call rejects before a server starts, with a `TypeError` that names the option and the element, for example `createTestServer: services[0] must be a service definition returned by defineService() or defineLazyService(), got the string "not-a-service".`

| Option | Default | Effect |
|---|---|---|
| `port` | `0` | Port to listen on; `0` picks a free one. |
| `host` | `127.0.0.1` | Address to listen on. The default keeps the server reachable from this machine only. Pass `0.0.0.0` when a test reaches the server from another container or host. `baseUrl` is `http://localhost:<port>` for the default and for `0.0.0.0` and `::`, and names the address otherwise. |
| `shutdown` | `{ timeout: 30000 }` | `shutdown.timeout` is the longest `close()` waits, in milliseconds, for calls still in flight. A unary handler that does not observe `ctx.signal` keeps `close()` waiting until then, so a test with a handler that can hang sets a short one; the unfinished call fails on the client. |

## Mock context and mock services {#mock-context}

`createMockContext({ catalog, mocks })` describes the first method of the first service of the catalog as `ctx.service`, `ctx.method` and `ctx.url`. When the handler under test belongs to another method, name it with `method: 'pkg.v1.Service/Method'` (the key format of `ctx.call`); an unknown service or method throws a `TypeError` naming `options.method`. `signal` supplies the inbound request's abort signal: `ctx.signal` aborts with it and the abort cascades into the handler's outgoing calls.

A `mockService` implementation that throws a `ConnectError` answers with exactly that error. Any other exception, such as a `TypeError` from a typo in the mock, arrives as a `ConnectError` with code `Internal`, the exception's own message and the exception as `cause`.

## Parity scenarios {#parity-scenarios}

`transportParityTest` compares the two outcomes with `defaultCompare`. Response headers, trailers and `ConnectError.metadata` are compared without protocol headers (`content-type`, `content-length`, `content-encoding`, `accept-encoding`, `date`, `te`, `grpc-*`, `connect-*`), so a scenario can report them exactly as the client sees them. A histogram measured in a unit of time, such as `rpc.server.call.duration`, is compared by observation count and attributes, not by the measured time. Pass your own `compare` to compare a protocol header literally.

To collect the telemetry of `@connectum/otel` interceptors in `ctx.spans` and `ctx.metrics`, run with `OTEL_TRACES_EXPORTER=none` and `OTEL_METRICS_EXPORTER=none` and call `shutdownProvider()` at the start of every scenario. Without it, every scenario after the first records nothing, and two empty lists compare as equal. `InMemoryMetricCollector.flush()` returns what was recorded since the previous flush and throws after `dispose()`. See [Cross-Transport Parity Invariant](/en/contributing/parity-invariant).

For executable end-to-end suites, see the examples' tests: [hris](https://github.com/Connectum-Framework/examples/tree/main/hris/tests) runs its whole flow in one process (the monolith topology, with an in-memory EventBus and a PGlite database), and every `with-events-*` example runs its saga against a real broker and separate services through `docker compose`. Exact testing helpers remain in the [`@connectum/testing` API](/en/api/@connectum/testing/); shared low-level fixtures are separated in [`@connectum/test-fixtures`](/en/packages/test-fixtures).

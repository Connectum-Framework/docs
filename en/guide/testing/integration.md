---
title: Integration tests
description: Exercise application wiring with in-process clients, real gRPC listeners and catalog mocks.
docType: how-to
outline: deep
---

# Integration tests

An integration test should build the application's real registration and
middleware, then exercise the boundary the assertion depends on. A separate
bare server can pass while the deployed application has missing routes or
rejects every caller.

`@connectum/testing` supplies local clients, test servers, catalog mocks,
in-memory telemetry collectors and a transport-parity driver. Choose between
the in-process boundary and a real listener explicitly.

## Installation {#installation}

::: pm
== npm
```bash
npm install -D @connectum/testing
```
== pnpm
```bash
pnpm add -D @connectum/testing
```
== bun
```bash
bun add -d @connectum/testing
```
:::

The protobuf and Connect peers are shared with your application; see
[peer dependency compatibility](/en/migration/peer-dependencies).

`@connectum/core` and `@connectum/test-fixtures` are installed as regular
dependencies.

## Test the application in process

For the default project from [Scaffold a service](/en/guide/scaffolding), build
the server through the same `buildServer()` entry the application uses. The
example below uses its unprotected sample greeting. If you selected auth,
configure the test issuer even when calling a public method, and supply
credentials when testing a protected one.

```typescript
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createLocalClient } from '@connectum/testing';
import { GreeterService } from '../gen/greeter/v1/greeter_pb.ts';
import { buildServer } from '../src/server.ts';

test('the application serves its public greeting', async () => {
  const server = buildServer();
  const client = createLocalClient(server, GreeterService);
  const response = await client.sayHello({ name: 'Ada' });
  assert.ok(response.message.includes('Ada'));
});
```

Use the generated descriptor path from your project if its layout differs.
The server needs no `start()` for local RPCs. The router and configured server
interceptors still run. This does not test TCP, TLS, a proxy or all wire encoding
details; see [in-process guarantees](/en/guide/production/in-process-transport-details).

Do not call `stop()` on a server that was never started: its state is still
`created`, and `stop()` requires `running`. This default scaffold opens no
application-owned pools in its factory. If yours does, release those resources
through the test fixture that owns them. Test the server's shutdown lifecycle
with a started listener.

## Test a real gRPC listener

When the test is specifically about listener behavior, `withTestServer()` starts
an isolated plaintext HTTP/2 server on an ephemeral port and closes it in
`finally`. With `greeterService` and its generated descriptor from the same
application:

```typescript
import assert from 'node:assert/strict';
import { createClient } from '@connectrpc/connect';
import { withTestServer } from '@connectum/testing';
import { GreeterService } from '../gen/greeter/v1/greeter_pb.ts';
import { greeterService } from '../src/services/greeterService.ts';

await withTestServer({ services: [greeterService] }, async (server) => {
  const client = createClient(GreeterService, server.transport);
  const response = await client.sayHello({ name: 'Ada' });
  assert.ok(response.message.includes('Ada'));
});
```

Pass required interceptors and protocols explicitly: the helper does not import
your application configuration. It does not expose all `CreateServerOptions`,
including TLS and request gates. For those boundaries, start your actual server
and exercise its configured listener. `createTestServer()` is the lower-level
alternative; its caller must always `await server.close()`.

### Test server options {#test-server}

`createTestServer` and `withTestServer` take `services`, `interceptors` and
`protocols` typed as `ServiceDefinition[]`, `Interceptor[]` and
`ProtocolRegistration[]`. A wrong type is a compile error; untyped callers are
rejected before a server starts with a `TypeError` naming the option and element,
for example `createTestServer: services[0] must be a service definition returned
by defineService() or defineLazyService(), got the string "not-a-service".`

| Option | Default | Effect |
|---|---|---|
| `port` | `0` | Port to listen on; `0` picks a free one. |
| `host` | `127.0.0.1` | Loopback keeps the server reachable from this machine only. Pass `0.0.0.0` for another container or host. `baseUrl` is `http://localhost:<port>` for the default, `0.0.0.0` and `::`, and names the address otherwise. |
| `shutdown` | `{ timeout: 30000 }` | Maximum time `close()` waits for calls in flight. A unary handler that ignores `ctx.signal` can hold it until this timeout; set a short one for a handler that can hang. The unfinished client call fails. |

## Keep catalog dependencies controlled

Use `mockService()` to pair a real descriptor with a partial test implementation,
then `mockResolver()` to route catalog calls to it. Unknown services return no
transport; compose a real resolver explicitly if the test should have a fallback.
Mock responses carry `x-connectum-mock: true`, so a test can verify that the
dependency was actually mocked. The complete setup lives in
[resolver tests](/en/guide/service-communication/resolver-configuration#testing-with-mocks).

### Mock context and failures {#mock-context}

`createMockContext({ catalog, mocks })` describes the first method of the first
service as `ctx.service`, `ctx.method` and `ctx.url`. Select another method with
`method: 'pkg.v1.Service/Method'`, using the key format of `ctx.call`. An unknown
service or method throws a `TypeError` naming `options.method`. A supplied
`signal` aborts `ctx.signal` and the handler's outgoing calls.

A `mockService` implementation that throws a `ConnectError` answers with exactly
that error. Any other exception reaches the caller as `ConnectError` with code
`Internal`, its own message and the original exception as `cause`.

## Telemetry and parity

`InMemorySpanCollector` and `InMemoryMetricCollector` let tests assert emitted
signals without a telemetry backend. Install them in the provider configuration
used by the test and isolate global provider state between cases. They collect
what the instrumentation emits; they do not add instrumentation to a server.

`InMemoryMetricCollector.flush()` returns observations since the previous flush
and throws after `dispose()`.

Import `transportParityTest` from `@connectum/testing/parity`, not the main
entry. This driver compares a scenario across transports; choose comparisons
that allow intentional transport differences. A successful local case alone
does not establish network parity.

### Parity comparison rules {#parity-scenarios}

`transportParityTest` uses `defaultCompare` to compare response headers, trailers
and `ConnectError.metadata` without protocol headers: `content-type`,
`content-length`, `content-encoding`, `accept-encoding`, `date`, `te`, `grpc-*`
and `connect-*`. A time histogram such as `rpc.server.call.duration` is compared
by observation count and attributes, not the measured time. Supply `compare`
when a scenario must compare protocol headers literally.

### Isolated telemetry {#isolated-telemetry}

For `@connectum/otel` instrumentation, pass `telemetry: { shutdownProvider }` to
`transportParityTest` and run with `OTEL_TRACES_EXPORTER=none` and
`OTEL_METRICS_EXPORTER=none`. Each run resets the provider, registers fresh span
and metric collectors, and unregisters them even when the scenario throws. The
reset function must come from the OTel instance used by the code under test;
testing accepts it as a parameter and does not depend on `@connectum/otel`.

Outside the parity driver, `withTelemetry({ shutdownProvider }, body)` supplies
the same isolated collectors and returns the body's result. Registrations are
process-wide: run telemetry cases sequentially; overlapping calls are rejected.
Only span and metric providers are registered. The helper sets no exporter
environment variables, context manager or propagator. Without the opt-in
telemetry option, the parity driver keeps its previous provider behavior.

Assert that collected telemetry is non-empty before returning it from a
scenario: comparing two empty arrays would otherwise pass. See the
[instrumented parity example](/en/guide/production/in-process-transport-details#testing)
and [`withTelemetry` API](/en/api/@connectum/testing/index/functions/withTelemetry).

### Catalog calls in a parity scenario {#catalog-calls}

Pass `catalog` and `remoteResolver` to compare handlers that use `ctx.call` or
`ctx.stream`; both runs receive those server options. Using the generated
contracts from the [Orders and Inventory example](/en/guide/service-communication/routing-example),
this test starts one remote Inventory listener and calls it through Orders:

```typescript
import assert from 'node:assert/strict';
import { after } from 'node:test';
import { createClient } from '@connectrpc/connect';
import { defineService, mapResolver } from '@connectum/core';
import { createTestServer } from '@connectum/testing';
import { transportParityTest } from '@connectum/testing/parity';
import { serviceCatalog } from '../gen/catalog.gen.ts';
import { InventoryService, OrdersService } from '../gen/shop/v1/catalog_pb.ts';

const inventory = await createTestServer({
  services: [defineService(InventoryService, {
    checkStock: (req) => ({ units: req.sku === 'A-1' ? 7 : 0 }),
  })],
});
after(() => inventory.close());

const orders = defineService(OrdersService, {
  async checkAvailability(req, ctx) {
    const stock = await ctx.call('shop.v1.InventoryService/CheckStock', { sku: req.sku });
    return { sku: req.sku, available: stock.units > 0 };
  },
});

transportParityTest('Orders reaches Inventory on both transports', {
  services: [orders],
  catalog: serviceCatalog,
  remoteResolver: mapResolver({ [InventoryService.typeName]: inventory.transport }),
  scenario: async ({ transport }) => {
    const result = await createClient(OrdersService, transport).checkAvailability({ sku: 'A-1' });
    assert.equal(result.available, true);
    assert.equal(result.sku, 'A-1');
    return { response: { sku: result.sku, available: result.available } };
  },
});
```

A dependency mounted in `services` is called in-process on both runs. Other
catalog dependencies use `remoteResolver`, whose transport must serve both
runs: start that remote service once for the whole test and reset any recorded
state between runs. Without these options, servers keep their previous setup;
`ctx.call` without a catalog fails as it does in the application.

The framework's parity suite uses a generated catalog to exercise local targets,
remote targets and two remote hops. Assert the expected result against the
[catalog contract](/en/guide/service-communication/catalog-configuration), then
compare the transport outcomes.

See the [testing API](/en/api/@connectum/testing/) for helper options and
[in-process testing](/en/guide/production/in-process-transport-details#testing)
for the parity scenario.
Finish with [E2E scenarios](/en/guide/testing/e2e) against the deployed boundary.

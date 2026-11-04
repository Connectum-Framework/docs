---
title: '@connectum/testing'
description: Supported service-test helpers, local clients, parity scenarios, in-memory telemetry collectors, and assertions.
docType: package-hub
---

# @connectum/testing

Supported service-test helpers, local clients, parity scenarios, in-memory telemetry collectors, and assertions.

## Install {#installation}

::: pm
== npm
~~~bash
npm install -D @connectum/testing
~~~
== pnpm
~~~bash
pnpm add -D @connectum/testing
~~~
== bun
~~~bash
bun add -d @connectum/testing
~~~
:::

**Peer dependencies:** `@bufbuild/protobuf` `^2.16.0`, `@connectrpc/connect` `^2.3.0` and
`@connectrpc/connect-node` `^2.3.0`, shared with your application. The package also installs
`@connectum/core` and `@connectum/test-fixtures` as regular dependencies. npm 7+, pnpm and Bun
install missing peers automatically — see
[Peer dependencies on protobuf and Connect](/en/migration/peer-dependencies).

## Start Here {#quick-start}

Use the service and generated `GreeterService` descriptor from
[Quickstart](/en/guide/quickstart).

~~~typescript
import assert from 'node:assert/strict';
import { createClient } from '@connectrpc/connect';
import { withTestServer } from '@connectum/testing';

await withTestServer({ services: [greeterService] }, async (server) => {
  const client = createClient(GreeterService, server.transport);
  const response = await client.sayHello({ name: 'Ada' });
  assert.equal(response.message, 'Hello, Ada!');
});
~~~

## Mocks, Fakes and Assertions {#mocks-and-assertions}

The main entry also re-exports the unit-test helpers of `@connectum/test-fixtures`, so one import covers a
test that does not start a server:

| Symbol | Use it to |
|---|---|
| [`createMockRequest`](/en/api/@connectum/testing/index/functions/createMockRequest) | Build a simplified request for an interceptor unit test. |
| [`createMockNext`](/en/api/@connectum/testing/index/functions/createMockNext), [`createMockNextError`](/en/api/@connectum/testing/index/functions/createMockNextError), [`createMockNextSlow`](/en/api/@connectum/testing/index/functions/createMockNextSlow) | Build a `next` function that resolves, throws a `ConnectError`, or resolves after a delay. |
| [`createMockFn`](/en/api/@connectum/testing/index/functions/createMockFn) | Create a function that records its calls (`.mock.calls`, `.mock.callCount()`). |
| [`createMockStream`](/en/api/@connectum/testing/index/functions/createMockStream) | Create an async iterable that yields given items, for streaming handlers and interceptors. |
| [`createFakeService`](/en/api/@connectum/testing/index/functions/createFakeService), [`createFakeMethod`](/en/api/@connectum/testing/index/functions/createFakeMethod), [`createMockDescMessage`](/en/api/@connectum/testing/index/functions/createMockDescMessage), [`createMockDescField`](/en/api/@connectum/testing/index/functions/createMockDescField), [`createMockDescMethod`](/en/api/@connectum/testing/index/functions/createMockDescMethod) | Build protobuf descriptors without running code generation. |
| [`assertConnectError`](/en/api/@connectum/testing/index/functions/assertConnectError) | Assert that a thrown value is a `ConnectError` with the expected code and, optionally, a matching message. |
| [`MOCK_RESPONSE_HEADER`](/en/api/@connectum/testing/index/variables/MOCK_RESPONSE_HEADER) | Name of the response header that marks a call served by `mockResolver()`. |

## Key Entry Points

| Entry point | Use it to |
|---|---|
| `createTestServer` | Create an isolated Connectum server for a test. |
| `withTestServer` | Manage test-server setup and teardown. |
| `createLocalClient` | Exercise handlers through the in-process transport. |
| `createMockContext`, `mockService`, `mockResolver` | Unit-test a handler's `ctx.call` / `ctx.stream` against canned services. |
| `transportParityTest` (`@connectum/testing/parity`) | Run one scenario over HTTP/2 and in-process and compare the outcomes. |
| `InMemorySpanCollector`, `InMemoryMetricCollector` | Collect spans and metrics in memory for assertions. |
| `withTelemetry` | Give one test body its own span and metric collectors for `@connectum/otel` instrumentation. |

Test server options, mock context behavior and the parity comparison are described in the [testing guide](/en/guide/testing#test-server).

## Spans and Metrics of `@connectum/otel` in a Test {#isolated-telemetry}

`@connectum/otel` keeps the tracer it created for the provider that was registered
when it first recorded something. A scenario that only registers its own collector
therefore sees spans in the first test of a process and nothing in later ones, and a
parity comparison of two empty results still passes.

Set the opt-in `telemetry` option of `transportParityTest` and the driver does the
whole sequence around every run: it resets the provider, registers that run's `spans`
and `metrics` collectors as the OpenTelemetry providers, and unregisters them when the
run ends, also when the scenario throws. Run with `OTEL_TRACES_EXPORTER=none` and
`OTEL_METRICS_EXPORTER=none`.

~~~typescript
import { createClient } from '@connectrpc/connect';
import { createOtelInterceptor, shutdownProvider } from '@connectum/otel';
import { transportParityTest } from '@connectum/testing/parity';

transportParityTest('Greeter.sayHello emits the same span on both transports', {
  services: [greeterRoutes],
  interceptors: [createOtelInterceptor()],
  telemetry: { shutdownProvider },
  scenario: async ({ transport, spans }) => {
    await createClient(GreeterService, transport).sayHello({ name: 'world' });
    return { spans: spans.flush() };
  },
});
~~~

Outside the parity driver, `withTelemetry({ shutdownProvider }, body)` does the same
around any async body and returns what the body returns:

~~~typescript
import { shutdownProvider } from '@connectum/otel';
import { withTelemetry } from '@connectum/testing';

const names = await withTelemetry({ shutdownProvider }, async ({ spans, metrics }) => {
  await client.sayHello({ name: 'world' });
  return spans.flush().map((span) => span.name);
});
~~~

What to know before you use either:

- `shutdownProvider` is a parameter, not an import. `@connectum/testing` does not
  depend on `@connectum/otel`, and the function that is reset must be the one your
  code under test uses.
- The registrations are process-wide, so scenarios that use telemetry run one after
  another. An overlapping call is refused with an error.
- Without `telemetry` the parity driver behaves as before.
- Only the span and metric providers are registered. The helper does not set the
  `OTEL_*_EXPORTER` variables, a context manager, or a propagator; set them yourself
  when the scenario needs them, for example to link a client span and a server span.
- Two empty results still compare as equal. Assert that `spans.flush()` is not empty
  before the scenario returns it.

## Catalog Calls in a Parity Scenario {#catalog-calls}

A handler that calls another service with `ctx.call` or `ctx.stream` goes through
the same catalog dispatch on both transports. Give `transportParityTest` the catalog
and, for services that run elsewhere, the resolver. Both servers of a run receive them
as `createServer({ catalog, remoteResolver })` would.

~~~typescript
import { createClient } from '@connectrpc/connect';
import { mapResolver } from '@connectum/core';
import { transportParityTest } from '@connectum/testing/parity';
import { serviceCatalog } from './gen/catalog.gen.ts'; // from protoc-gen-connectum-catalog

transportParityTest('Orders.createOrder reaches Inventory identically', {
  services: [ordersService], // Inventory is not mounted here
  catalog: serviceCatalog,
  remoteResolver: mapResolver({ 'shop.v1.InventoryService': inventoryTransport }),
  scenario: async ({ transport }) => {
    const order = await createClient(OrdersService, transport).createOrder({ sku: 'A-1' });
    return { response: { orderId: order.orderId } };
  },
});
~~~

What to know before you use them:

- A service in `services` is called in-process on both runs. Any other catalog
  service goes through `remoteResolver`, as in production.
- The resolver is called by both runs of a test, so the transport it returns serves
  both. Start the remote service once for the whole test, for example in `before`,
  and reset whatever it records between the runs.
- Without these options the servers are built as before, and a handler's `ctx.call`
  fails as it does on a server without a catalog.
- The parity suite of the framework runs this on a catalog that `buf generate` and
  `protoc-gen-connectum-catalog` produce, with the target on the same server, on
  another server, and behind two remote hops. Check the expected results against the
  documented contract ([Service Catalog](/en/reference/service-catalog)), then compare the two
  runs, as the suite's scenarios do.

## Learn / Configure / API Reference {#api-reference}

- **Learn:** [Focused guide](/en/guide/testing)
- **Configure:** [Task and configuration guidance](/en/guide/testing)
- **API reference:** [Exact options and symbols](/en/api/@connectum/testing/types/interfaces/CreateTestServerOptions)
- **Package API index:** [Generated TypeDoc](/en/api/@connectum/testing/)
- **Source:** [@connectum/testing on GitHub](https://github.com/Connectum-Framework/connectum/tree/main/packages/testing)

## Related Modules {#related-packages}

[Compare all Connectum packages](/en/packages/) by capability.

<!-- Compatibility anchors retained from the former exhaustive package page. -->
<div class="legacy-anchors" aria-hidden="true">
<span id="mock-request"></span>
<span id="createmockrequestoptions"></span>
<span id="mock-next-functions"></span>
<span id="createmocknextoptions"></span>
<span id="createmocknexterrorcode-message"></span>
<span id="createmocknextslowdelay-options"></span>
<span id="assertions"></span>
<span id="assertconnecterrorerror-expectedcode-messagepattern"></span>
<span id="protobuf-descriptor-mocks"></span>
<span id="createmockdescmessagetypename-options"></span>
<span id="createmockdescfieldlocalname-options"></span>
<span id="createmockdescmethodname-options"></span>
<span id="fake-service-descriptors"></span>
<span id="createfakeserviceoptions"></span>
<span id="createfakemethodservice-name-options"></span>
<span id="streaming"></span>
<span id="createmockstreamitems-options"></span>
<span id="test-server"></span>
<span id="createtestserveroptions"></span>
<span id="withtestserveroptions-testfn"></span>
<span id="exports-summary"></span>
</div>

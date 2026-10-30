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

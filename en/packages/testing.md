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

## Start Here {#quick-start}

~~~typescript
import { createClient } from '@connectrpc/connect';
import { withTestServer } from '@connectum/testing';

await withTestServer({ services: [greeterService] }, async (server) => {
  const client = createClient(GreeterService, server.transport);
  const response = await client.sayHello({ name: 'Ada' });
});
~~~

For a complete, source-verified workflow, continue with the focused guide below.

## Key Entry Points

| Entry point | Use it to |
|---|---|
| `createTestServer` | Create an isolated Connectum server for a test. |
| `withTestServer` | Manage test-server setup and teardown. |
| `createLocalClient` | Exercise handlers through the in-process transport. |

Runtime boundaries and extension seams remain in [Connectum Runtime Architecture](/en/guide/production/architecture).

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

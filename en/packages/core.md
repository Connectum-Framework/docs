---
title: '@connectum/core'
description: Server foundation for registration, lifecycle, transport, configuration, TLS, and typed service calls.
docType: package-hub
---

# @connectum/core

Server foundation for registration, lifecycle, transport, configuration, TLS, and typed service calls.

## Install {#installation}

::: pm
== npm
~~~bash
npm install @connectum/core
~~~
== pnpm
~~~bash
pnpm add @connectum/core
~~~
== bun
~~~bash
bun add @connectum/core
~~~
:::

## Start Here {#quick-start}

~~~typescript
import { createServer } from '@connectum/core';

const server = createServer({
  services: [greeterService],
  port: 5000,
  shutdown: { autoShutdown: true },
});

await server.start();
~~~

For a complete, source-verified workflow, continue with the focused guide below.

## Key Entry Points

| Entry point | Use it to |
|---|---|
| `createServer` | Compose services, protocols, interceptors, and shutdown policy. |
| `defineService` | Bind a generated service descriptor to typed handlers. |
| `createCatalogClient` | Call catalog services outside a server handler. |

Runtime boundaries and extension seams remain in [Connectum Runtime Architecture](/en/guide/production/architecture).

## Learn / Configure / API Reference {#api-reference}

- **Learn:** [Focused guide](/en/guide/server)
- **Configure:** [Task and configuration guidance](/en/guide/server/configuration)
- **API reference:** [Exact options and symbols](/en/api/@connectum/core/types/interfaces/CreateServerOptions)
- **Package API index:** [Generated TypeDoc](/en/api/@connectum/core/)
- **Source:** [@connectum/core on GitHub](https://github.com/Connectum-Framework/connectum/tree/main/packages/core)

## Related Modules {#related-packages}

[Compare all Connectum packages](/en/packages/) by capability.

<!-- Compatibility anchors retained from the former exhaustive package page. -->
<div class="legacy-anchors" aria-hidden="true">
<span id="createserveroptions"></span>
<span id="json-serialization"></span>
<span id="server-interface"></span>
<span id="lifecycle-methods"></span>
<span id="state-properties"></span>
<span id="runtime-operations-before-start"></span>
<span id="shutdown-hooks"></span>
<span id="in-process-transport"></span>
<span id="createcatalogclientoptions"></span>
<span id="serverstate"></span>
<span id="lifecycleevent"></span>
<span id="shutdownoptions"></span>
<span id="protocol-plugin-system"></span>
<span id="tls-configuration"></span>
<span id="environment-configuration-connectumcoreconfig"></span>
<span id="server-lifecycle"></span>
<span id="error-protocol"></span>
<span id="sanitizableerror-interface"></span>
<span id="issanitizableerrorerr"></span>
<span id="published-package-format"></span>
<span id="exports-summary"></span>
</div>

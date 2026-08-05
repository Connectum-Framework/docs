---
title: '@connectum/otel'
description: OpenTelemetry providers, server/client RPC instrumentation, metrics, logging, and deep tracing helpers.
docType: package-hub
---

# @connectum/otel

OpenTelemetry providers, server/client RPC instrumentation, metrics, logging, and deep tracing helpers.

## Install {#installation}

::: pm
== npm
~~~bash
npm install @connectum/otel
~~~
== pnpm
~~~bash
pnpm add @connectum/otel
~~~
== bun
~~~bash
bun add @connectum/otel
~~~
:::

## Start Here {#quick-start}

~~~typescript
import { createOtelInterceptor, initProvider } from '@connectum/otel';

initProvider({ serviceName: 'orders-service' });
const interceptor = createOtelInterceptor({ serverPort: 5000 });
~~~

For a complete, source-verified workflow, continue with the focused guide below.

## Key Entry Points

| Entry point | Use it to |
|---|---|
| `initProvider` | Initialize trace, metric, and log providers. |
| `createOtelInterceptor` | Instrument inbound RPCs. |
| `createOtelClientInterceptor` | Instrument outbound RPCs and propagate context. |

Architecture-layer and dependency details remain in the [Architecture Overview](/en/guide/production/architecture).

## Learn / Configure / API Reference {#api-reference}

- **Learn:** [Focused guide](/en/guide/observability)
- **Configure:** [Task and configuration guidance](/en/guide/observability/backends)
- **API reference:** [Exact options and symbols](/en/api/@connectum/otel/interfaces/OtelInterceptorOptions)
- **Package API index:** [Generated TypeDoc](/en/api/@connectum/otel/)
- **Source:** [@connectum/otel on GitHub](https://github.com/Connectum-Framework/connectum/tree/main/packages/otel)

## Related Modules {#related-packages}

[Compare all Connectum packages](/en/packages/) by capability.

<!-- Compatibility anchors retained from the former exhaustive package page. -->
<div class="legacy-anchors" aria-hidden="true">
<span id="server-interceptor"></span>
<span id="createotelinterceptoroptions"></span>
<span id="client-interceptor"></span>
<span id="createotelclientinterceptoroptions"></span>
<span id="streaming-rpc-instrumentation"></span>
<span id="streaming-attributes"></span>
<span id="deep-tracing-helpers"></span>
<span id="tracedfn-options"></span>
<span id="traceallobj-options"></span>
<span id="logger"></span>
<span id="getloggername-options"></span>
<span id="provider-management"></span>
<span id="initprovideroptions"></span>
<span id="getprovider"></span>
<span id="shutdownprovider"></span>
<span id="standalone-instances"></span>
<span id="rpc-metrics"></span>
<span id="configuration"></span>
<span id="environment-variables"></span>
<span id="exportertype"></span>
<span id="semantic-conventions"></span>
<span id="exports-summary"></span>
<span id="in-process-transport"></span>
<span id="parity-guarantees"></span>
<span id="notes"></span>
<span id="example"></span>
</div>

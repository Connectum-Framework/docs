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
# pnpm 11 and later: decline the build script of protobufjs, a transitive dependency of the
# OTLP gRPC exporters. Without the flag the install ends with ERR_PNPM_IGNORED_BUILDS (exit code 1).
pnpm add --allow-build='!protobufjs' @connectum/otel
~~~
== bun
~~~bash
bun add @connectum/otel
~~~
:::

**Peer dependencies:** `@bufbuild/protobuf` `^2.16.0` and `@connectrpc/connect` `^2.2.0`,
shared with your application. npm 7+, pnpm and Bun install missing peers automatically — see
[Peer dependencies on protobuf and Connect](/en/migration/peer-dependencies).

## Start Here {#quick-start}

~~~typescript
import { createOtelInterceptor, initProvider } from '@connectum/otel';

initProvider({ serviceName: 'orders-service' });
const interceptor = createOtelInterceptor({ serverPort: 5000 });
~~~

Since 1.3.0, the package holds one provider per process whichever subpath you import from:
`getProvider()` from `@connectum/otel` and from `@connectum/otel/provider` return the same
object, and a tracer taken from `@connectum/otel/tracer` belongs to the provider that
`initProvider` created. The subpath builds share one chunk of common modules. In 1.2.x each
subpath carried a private copy of the provider, so mixing the root and a subpath import
could create a second provider that competed for OpenTelemetry's global registration.

## Key Entry Points

| Entry point | Use it to |
|---|---|
| `initProvider` | Initialize trace, metric, and log providers. |
| `getProvider` / `OtelProvider` | Get the shared provider (`tracer`, `meter`, `logger`, `shutdown()`) and name its type; see [Provider management](/en/guide/observability/backends#provider-management). |
| `createOtelInterceptor` | Instrument inbound RPCs. |
| `createOtelClientInterceptor` | Instrument outbound RPCs and propagate context. |

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

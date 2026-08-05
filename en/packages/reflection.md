---
title: '@connectum/reflection'
description: gRPC Server Reflection v1 and v1alpha for discovery and tooling.
docType: package-hub
---

# @connectum/reflection

gRPC Server Reflection v1 and v1alpha for discovery and tooling.

## Install {#installation}

::: pm
== npm
~~~bash
npm install @connectum/reflection
~~~
== pnpm
~~~bash
pnpm add @connectum/reflection
~~~
== bun
~~~bash
bun add @connectum/reflection
~~~
:::

## Start Here {#quick-start}

~~~typescript
import { Reflection } from '@connectum/reflection';

const server = createServer({
  services: [greeterService],
  protocols: [Reflection()],
});
~~~

For a complete, source-verified workflow, continue with the focused guide below.

## Key Entry Points

| Entry point | Use it to |
|---|---|
| `Reflection` | Register reflection as a server protocol. |
| `collectFileProtos` | Collect transitive file descriptors for reflection. |

Architecture-layer and dependency details remain in the [Architecture Overview](/en/guide/production/architecture).

## Learn / Configure / API Reference {#api-reference}

- **Learn:** [Focused guide](/en/guide/protocols/reflection)
- **Configure:** [Task and configuration guidance](/en/guide/protocols/reflection)
- **API reference:** [Exact options and symbols](/en/api/@connectum/reflection/functions/Reflection)
- **Package API index:** [Generated TypeDoc](/en/api/@connectum/reflection/)
- **Source:** [@connectum/reflection on GitHub](https://github.com/Connectum-Framework/connectum/tree/main/packages/reflection)

## Related Modules {#related-packages}

[Compare all Connectum packages](/en/packages/) by capability.

<!-- Compatibility anchors retained from the former exhaustive package page. -->
<div class="legacy-anchors" aria-hidden="true">
<span id="reflection"></span>
<span id="collectfileprotosfiles"></span>
<span id="how-it-works"></span>
<span id="usage-with-grpcurl"></span>
<span id="usage-with-buf-curl"></span>
<span id="combined-with-healthcheck"></span>
<span id="exports-summary"></span>
</div>

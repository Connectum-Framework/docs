---
title: '@connectum/healthcheck'
description: gRPC health protocol, HTTP health/readiness endpoints, and mutable serving state.
docType: package-hub
---

# @connectum/healthcheck

gRPC health protocol, HTTP health/readiness endpoints, and mutable serving state.

## Install {#installation}

::: pm
== npm
~~~bash
npm install @connectum/healthcheck
~~~
== pnpm
~~~bash
pnpm add @connectum/healthcheck
~~~
== bun
~~~bash
bun add @connectum/healthcheck
~~~
:::

## Start Here {#quick-start}

~~~typescript
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';

const protocols = [Healthcheck({ httpEnabled: true })];
healthcheckManager.update(ServingStatus.SERVING);
~~~

For a complete, source-verified workflow, continue with the focused guide below.

## Key Entry Points

| Entry point | Use it to |
|---|---|
| `Healthcheck` | Register gRPC health and optional HTTP endpoints. |
| `healthcheckManager` | Update overall or per-service serving state. |
| `ServingStatus` | Use protocol-defined readiness values. |

Architecture-layer and dependency details remain in the [Architecture Overview](/en/guide/production/architecture).

## Learn / Configure / API Reference {#api-reference}

- **Learn:** [Focused guide](/en/guide/health-checks)
- **Configure:** [Task and configuration guidance](/en/guide/health-checks/kubernetes)
- **API reference:** [Exact options and symbols](/en/api/@connectum/healthcheck/@connectum/healthcheck/types/interfaces/HealthcheckOptions)
- **Package API index:** [Generated TypeDoc](/en/api/@connectum/healthcheck/)
- **Source:** [@connectum/healthcheck on GitHub](https://github.com/Connectum-Framework/connectum/tree/main/packages/healthcheck)

## Related Modules {#related-packages}

[Compare all Connectum packages](/en/packages/) by capability.

<!-- Compatibility anchors retained from the former exhaustive package page. -->
<div class="legacy-anchors" aria-hidden="true">
<span id="healthcheckoptions"></span>
<span id="healthcheckmanager-singleton"></span>
<span id="healthcheckmanager-class"></span>
<span id="services-vs-components"></span>
<span id="createhealthcheckmanager"></span>
<span id="servingstatus"></span>
<span id="grpc-health-check-protocol"></span>
<span id="testing-with-grpcurl"></span>
<span id="http-health-endpoints"></span>
<span id="response-format"></span>
<span id="http-status-code-mapping"></span>
<span id="exports-summary"></span>
</div>

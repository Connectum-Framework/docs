---
title: '@connectum/interceptors'
description: ConnectRPC middleware for errors, validation, timeouts, resilience, logging, serialization, and method routing.
docType: package-hub
---

# @connectum/interceptors

ConnectRPC middleware for errors, validation, timeouts, resilience, logging, serialization, and method routing.

## Install {#installation}

::: pm
== npm
~~~bash
npm install @connectum/interceptors
~~~
== pnpm
~~~bash
pnpm add @connectum/interceptors
~~~
== bun
~~~bash
bun add @connectum/interceptors
~~~
:::

## Start Here {#quick-start}

~~~typescript
import { createDefaultInterceptors } from '@connectum/interceptors';

const interceptors = createDefaultInterceptors({
  timeout: { duration: 10_000 },
  validation: true,
});
~~~

For a complete, source-verified workflow, continue with the focused guide below.

## Key Entry Points

| Entry point | Use it to |
|---|---|
| `createDefaultInterceptors` | Build the ordered default chain; resilience remains opt-in. |
| `createMethodFilterInterceptor` | Apply an interceptor to selected methods. |
| `createErrorHandlerInterceptor` | Normalize and sanitize handler failures. |

Architecture-layer and dependency details remain in the [Architecture Overview](/en/guide/production/architecture).

## Learn / Configure / API Reference {#api-reference}

- **Learn:** [Focused guide](/en/guide/interceptors)
- **Configure:** [Task and configuration guidance](/en/guide/interceptors/built-in)
- **API reference:** [Exact options and symbols](/en/api/@connectum/interceptors/defaults/interfaces/DefaultInterceptorOptions)
- **Package API index:** [Generated TypeDoc](/en/api/@connectum/interceptors/)
- **Source:** [@connectum/interceptors on GitHub](https://github.com/Connectum-Framework/connectum/tree/main/packages/interceptors)

## Related Modules {#related-packages}

[Compare all Connectum packages](/en/packages/) by capability.

<!-- Compatibility anchors retained from the former exhaustive package page. -->
<div class="legacy-anchors" aria-hidden="true">
<span id="default-interceptor-chain"></span>
<span id="createdefaultinterceptorsoptions"></span>
<span id="defaultinterceptoroptions"></span>
<span id="individual-interceptors"></span>
<span id="error-handler"></span>
<span id="timeout"></span>
<span id="bulkhead"></span>
<span id="circuit-breaker"></span>
<span id="retry"></span>
<span id="fallback"></span>
<span id="validation"></span>
<span id="serializer"></span>
<span id="method-filter-interceptor"></span>
<span id="pattern-resolution-order"></span>
<span id="methodfiltermap"></span>
<span id="exports-summary"></span>
</div>

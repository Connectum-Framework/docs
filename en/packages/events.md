---
title: '@connectum/events'
description: Proto-first publish/subscribe with routes, middleware, retries, dead letters, and pluggable adapters.
docType: package-hub
---

# @connectum/events

Proto-first publish/subscribe with routes, middleware, retries, dead letters, and pluggable adapters.

## Install {#installation}

::: pm
== npm
~~~bash
npm install @connectum/events
~~~
== pnpm
~~~bash
pnpm add @connectum/events
~~~
== bun
~~~bash
bun add @connectum/events
~~~
:::

## Start Here {#quick-start}

~~~typescript
import { createEventBus, MemoryAdapter } from '@connectum/events';

const eventBus = createEventBus({
  adapter: MemoryAdapter(),
  routes: [orderEvents],
  group: 'orders-service',
});

await eventBus.start();
~~~

For a complete, source-verified workflow, continue with the focused guide below.

## Key Entry Points

| Entry point | Use it to |
|---|---|
| `createEventBus` | Create the lifecycle-managed event bus. |
| `MemoryAdapter` | Run deterministic in-memory event tests. |
| `createBroadcastSubscribers` | Create explicit one-to-many reactor subscribers. |

Runtime boundaries and extension seams remain in [Connectum Runtime Architecture](/en/guide/production/architecture).

## Learn / Configure / API Reference {#api-reference}

- **Learn:** [Focused guide](/en/guide/events)
- **Configure:** [Task and configuration guidance](/en/guide/events/getting-started)
- **API reference:** [Exact options and symbols](/en/api/@connectum/events/types/interfaces/EventBusOptions)
- **Package API index:** [Generated TypeDoc](/en/api/@connectum/events/)
- **Source:** [@connectum/events on GitHub](https://github.com/Connectum-Framework/connectum/tree/main/packages/events)

## Related Modules {#related-packages}

[Compare all Connectum packages](/en/packages/) by capability.

<!-- Compatibility anchors retained from the former exhaustive package page. -->
<div class="legacy-anchors" aria-hidden="true">
<span id="core-concepts"></span>
<span id="eventbus"></span>
<span id="eventadapter"></span>
<span id="eventrouter"></span>
<span id="eventcontext"></span>
<span id="createeventbusoptions"></span>
<span id="eventbusoptions"></span>
<span id="publishoptions"></span>
<span id="middlewareconfig"></span>
<span id="retryoptions"></span>
<span id="dlqoptions"></span>
<span id="createbroadcastsubscribersoptions"></span>
<span id="broadcastsubscribersoptions"></span>
<span id="broadcastreactor"></span>
<span id="middleware"></span>
<span id="configuration"></span>
<span id="integration-with-createserver"></span>
<span id="dependency-injection-and-testing"></span>
<span id="consumer-groups"></span>
<span id="graceful-shutdown"></span>
<span id="exports-summary"></span>
<span id="type-exports"></span>
<span id="learn-more"></span>
</div>

---
title: '@connectum/events-nats'
description: NATS JetStream adapter with durable consumers, subjects, metadata, and at-least-once delivery.
docType: package-hub
---

# @connectum/events-nats

NATS JetStream adapter with durable consumers, subjects, metadata, and at-least-once delivery.

## Install {#installation}

::: pm
== npm
~~~bash
npm install @connectum/events-nats
~~~
== pnpm
~~~bash
pnpm add @connectum/events-nats
~~~
== bun
~~~bash
bun add @connectum/events-nats
~~~
:::

## Start Here {#quick-start}

~~~typescript
import { NatsAdapter } from '@connectum/events-nats';

const adapter = NatsAdapter({
  servers: 'nats://localhost:4222',
});
~~~

For a complete, source-verified workflow, continue with the focused guide below.

## Key Entry Points

| Entry point | Use it to |
|---|---|
| `NatsAdapter` | Connect EventBus to NATS JetStream. |
| `NatsAdapterOptions` | Configure servers, stream, connection, and consumer behavior. |

Architecture-layer and dependency details remain in the [Architecture Overview](/en/guide/production/architecture).

## Learn / Configure / API Reference {#api-reference}

- **Learn:** [Focused guide](/en/guide/events/adapters)
- **Configure:** [Task and configuration guidance](/en/guide/events/adapters)
- **API reference:** [Exact options and symbols](/en/api/@connectum/events-nats/types/interfaces/NatsAdapterOptions)
- **Package API index:** [Generated TypeDoc](/en/api/@connectum/events-nats/)
- **Source:** [@connectum/events-nats on GitHub](https://github.com/Connectum-Framework/connectum/tree/main/packages/events-nats)

## Related Modules {#related-packages}

[Compare all Connectum packages](/en/packages/) by capability.

<!-- Compatibility anchors retained from the former exhaustive package page. -->
<div class="legacy-anchors" aria-hidden="true">
<span id="natsadapteroptions"></span>
<span id="natsconsumeroptions"></span>
<span id="configuration-examples"></span>
<span id="single-server"></span>
<span id="cluster-connection"></span>
<span id="custom-stream-and-consumer-options"></span>
<span id="advanced-nats-connection"></span>
<span id="adapter-lifecycle"></span>
<span id="jetstream-concepts"></span>
<span id="streams"></span>
<span id="consumers"></span>
<span id="subjects"></span>
<span id="deliver-policies"></span>
<span id="at-least-once-delivery"></span>
<span id="metadata-propagation"></span>
<span id="exports-summary"></span>
<span id="learn-more"></span>
</div>

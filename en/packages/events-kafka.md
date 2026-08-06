---
title: '@connectum/events-kafka'
description: Kafka and Redpanda adapter with consumer groups, topic patterns, and message headers.
docType: package-hub
---

# @connectum/events-kafka

Kafka and Redpanda adapter with consumer groups, topic patterns, and message headers.

## Install {#installation}

::: pm
== npm
~~~bash
npm install @connectum/events-kafka
~~~
== pnpm
~~~bash
pnpm add @connectum/events-kafka
~~~
== bun
~~~bash
bun add @connectum/events-kafka
~~~
:::

## Start Here {#quick-start}

~~~typescript
import { KafkaAdapter } from '@connectum/events-kafka';

const adapter = KafkaAdapter({
  brokers: ['localhost:9092'],
  clientId: 'orders-service',
});
~~~

For a complete, source-verified workflow, continue with the focused guide below.

## Key Entry Points

| Entry point | Use it to |
|---|---|
| `KafkaAdapter` | Connect EventBus to Kafka or Redpanda. |
| `KafkaAdapterOptions` | Configure brokers, client, producer, and consumer behavior. |

Runtime boundaries and extension seams remain in [Connectum Runtime Architecture](/en/guide/production/architecture).

## Learn / Configure / API Reference {#api-reference}

- **Learn:** [Focused guide](/en/guide/events/adapters)
- **Configure:** [Task and configuration guidance](/en/guide/events/adapters)
- **API reference:** [Exact options and symbols](/en/api/@connectum/events-kafka/types/interfaces/KafkaAdapterOptions)
- **Package API index:** [Generated TypeDoc](/en/api/@connectum/events-kafka/)
- **Source:** [@connectum/events-kafka on GitHub](https://github.com/Connectum-Framework/connectum/tree/main/packages/events-kafka)

## Related Modules {#related-packages}

[Compare all Connectum packages](/en/packages/) by capability.

<!-- Compatibility anchors retained from the former exhaustive package page. -->
<div class="legacy-anchors" aria-hidden="true">
<span id="kafkaadapteroptions"></span>
<span id="eventadapter-interface"></span>
<span id="topic-pattern-matching"></span>
<span id="message-headers"></span>
<span id="redpanda-compatibility"></span>
<span id="configuration"></span>
<span id="minimal-configuration"></span>
<span id="full-configuration"></span>
<span id="with-eventbus-middleware"></span>
<span id="with-server-integration"></span>
<span id="exports-summary"></span>
</div>

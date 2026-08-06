---
title: '@connectum/events-amqp'
description: AMQP and RabbitMQ adapter with topology, confirms, recovery, and external-contract publishing.
docType: package-hub
---

# @connectum/events-amqp

AMQP and RabbitMQ adapter with topology, confirms, recovery, and external-contract publishing.

## Install {#installation}

::: pm
== npm
~~~bash
npm install @connectum/events-amqp
~~~
== pnpm
~~~bash
pnpm add @connectum/events-amqp
~~~
== bun
~~~bash
bun add @connectum/events-amqp
~~~
:::

## Start Here {#quick-start}

~~~typescript
import { AmqpAdapter } from '@connectum/events-amqp';

const adapter = AmqpAdapter({
  url: 'amqp://localhost:5672',
  exchange: 'events',
  exchangeType: 'topic',
});
~~~

For a complete, source-verified workflow, continue with the focused guide below.

## Key Entry Points

| Entry point | Use it to |
|---|---|
| `AmqpAdapter` | Connect EventBus to an AMQP broker. |
| `AmqpAdapterOptions` | Configure connection, topology, publishing, and recovery. |
| `isAutoRetriablePublishError` | Classify adapter failures for retry policy. |

Runtime boundaries and extension seams remain in [Connectum Runtime Architecture](/en/guide/production/architecture).

## Learn / Configure / API Reference {#api-reference}

- **Learn:** [Focused guide](/en/guide/events/adapters)
- **Configure:** [Task and configuration guidance](/en/guide/events/adapters)
- **API reference:** [Exact options and symbols](/en/api/@connectum/events-amqp/types/interfaces/AmqpAdapterOptions)
- **Package API index:** [Generated TypeDoc](/en/api/@connectum/events-amqp/)
- **Source:** [@connectum/events-amqp on GitHub](https://github.com/Connectum-Framework/connectum/tree/main/packages/events-amqp)

## Related Modules {#related-packages}

[Compare all Connectum packages](/en/packages/) by capability.

<!-- Compatibility anchors retained from the former exhaustive package page. -->
<div class="legacy-anchors" aria-hidden="true">
<span id="amqpadapteroptions"></span>
<span id="amqpexchangeoptions"></span>
<span id="amqpqueueoptions"></span>
<span id="amqpconsumeroptions"></span>
<span id="amqppublisheroptions"></span>
<span id="amqpserializationoptions"></span>
<span id="amqptopology"></span>
<span id="topology-modes"></span>
<span id="amqpqueueoverride"></span>
<span id="amqprecoveryoptions"></span>
<span id="amqplifecyclecallbacks"></span>
<span id="configuration-examples"></span>
<span id="minimal"></span>
<span id="full-configuration"></span>
<span id="tls-connection"></span>
<span id="virtual-host-vhost"></span>
<span id="lavinmq"></span>
<span id="external-amqp-contract"></span>
<span id="reliable-publishing"></span>
<span id="error-taxonomy"></span>
<span id="connection-recovery"></span>
<span id="tuning-the-reconnect-backoff"></span>
<span id="adapter-lifecycle"></span>
<span id="amqp-concepts"></span>
<span id="exchanges"></span>
<span id="queues"></span>
<span id="routing-keys"></span>
<span id="wildcard-binding"></span>
<span id="consumer-groups-competing-consumers"></span>
<span id="dead-letter-exchange-dlx"></span>
<span id="at-least-once-delivery"></span>
<span id="delivery-attempts"></span>
<span id="metadata-propagation"></span>
<span id="testing"></span>
<span id="testing-subpath-exports"></span>
<span id="exports-summary"></span>
<span id="learn-more"></span>
</div>

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

The package depends on `amqplib` `^2.2.0`; connection recovery and the reconnect
backoff come from amqplib's built-in recovery. For production settings, continue with
[Run the AMQP adapter reliably](/en/guide/events/amqp-reliability).

## Key Entry Points

| Entry point | Use it to |
|---|---|
| [`AmqpAdapter`](/en/api/@connectum/events-amqp/functions/AmqpAdapter) | Connect EventBus to an AMQP broker. |
| [`AmqpAdapterOptions`](/en/api/@connectum/events-amqp/types/interfaces/AmqpAdapterOptions) | Configure connection, topology, publishing, recovery, and `publishRetry`. |
| [`AmqpLifecycleEvent`](/en/api/@connectum/events-amqp/types/type-aliases/AmqpLifecycleEvent) | Observe the connection through `lifecycle.onLifecycle`. |
| [`isAutoRetriablePublishError`](/en/api/@connectum/events-amqp/functions/isAutoRetriablePublishError) | Tell whether a publish failure belongs to the error classes `publishRetry` retries. |
| [`AmqpTopologyError`](/en/api/@connectum/events-amqp/classes/AmqpTopologyError) | Identify a failed declaration through its `object` field. |
| [`FakeAmqpAdapter`](/en/api/@connectum/events-amqp/testing/functions/FakeAmqpAdapter) | Test failure handling without a broker (`@connectum/events-amqp/testing`). |
| [`AmqpRecoveryOptions`](/en/api/@connectum/events-amqp/types/interfaces/AmqpRecoveryOptions) | Bound the initial connect (`initialConnectMaxRetries`) and set the reconnect delay schedule, including a custom `backoff` hook (since 1.3.0). See [Set your own reconnect delay](/en/guide/events/amqp-reliability#custom-backoff-hook). |

## Reliable Publishing {#reliable-publishing}

`publish()` resolves on broker confirmation. A retry after a lost confirmation can
duplicate a message; see [Reliable publishing](/en/guide/events/amqp-reliability#reliable-publishing)
for retry policy and deduplication guidance.

## Connection Recovery {#connection-recovery}

The adapter reconnects and restores topology and subscriptions by default. Recovery
limits, fatal topology errors, and the behavior after recovery stops are documented in
[Connection recovery](/en/guide/events/amqp-reliability#connection-recovery).

## Tuning the Reconnect Backoff {#tuning-the-reconnect-backoff}

The `backoff` option customizes reconnect delays; see
[Tuning the reconnect backoff](/en/guide/events/amqp-reliability#tuning-the-reconnect-backoff)
for its parameters and examples.

## Adapter Lifecycle {#adapter-lifecycle}

The `lifecycle.onLifecycle` callback reports connection and consumer events. Flat
callbacks are deprecated; see [Adapter lifecycle](/en/guide/events/amqp-reliability#adapter-lifecycle)
for event names, callback behavior, and migration guidance.

## Testing {#testing-subpath-exports}

The `@connectum/events-amqp/testing` subpath exports the in-memory `FakeAmqpAdapter`;
see [Testing](/en/guide/events/amqp-reliability#testing-subpath-exports).

## Learn / Configure / API Reference {#api-reference}

- **Learn:** [Choose an event adapter](/en/guide/events/adapters#amqp--rabbitmq-adapter)
- **Configure:** [Run the AMQP adapter reliably](/en/guide/events/amqp-reliability)
- **Upgrade:** [events-amqp 1.3 behavior changes](/en/migration/events-amqp-1.3)
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
<span id="error-taxonomy"></span>
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
<span id="exports-summary"></span>
<span id="learn-more"></span>
</div>

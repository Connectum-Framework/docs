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

Runtime boundaries and extension seams remain in [Connectum Runtime Architecture](/en/guide/production/architecture).

## Reliable Publishing {#reliable-publishing}

Each `publish()` resolves on the broker's confirm for that message or rejects with a
typed error; the error class tells you whether republishing is safe. The opt-in
`publishRetry` option retries connection failures in place with a bounded budget
(5 retries by default), and `isAutoRetriablePublishError` exposes its error-class rule
for your own retry logic. A retry can duplicate a message whose confirm was lost; dedupe
on `x-event-id`. See [Reliable publishing](/en/guide/events/amqp-reliability#reliable-publishing)
and [`AmqpPublishRetryOptions`](/en/api/@connectum/events-amqp/types/interfaces/AmqpPublishRetryOptions).

## Connection Recovery {#connection-recovery}

Recovery is on by default: the adapter reconnects, re-applies topology, and restarts
subscriptions. `recovery.maxRetries` (default `Infinity`) bounds every outage and the
initial connect; `recovery.initialConnectMaxRetries` bounds only startup.
`treatTopologyErrorAsFatal` stops recovery on deterministic topology drift. When
recovery gives up, the adapter drops the connection and **all subscriptions**: a later
`connect()` starts clean and you must subscribe again. See
[Connection recovery](/en/guide/events/amqp-reliability#connection-recovery) and
[`AmqpRecoveryOptions`](/en/api/@connectum/events-amqp/types/interfaces/AmqpRecoveryOptions).

## Tuning the Reconnect Backoff {#tuning-the-reconnect-backoff}

Reconnect delays follow amqplib 2.2's formula: exponential growth from `initialDelay`
by `factor`, symmetric `jitter`, and a base capped at `maxDelay / (1 + jitter)`, so no
delay exceeds `maxDelay`. With the defaults a saturated delay is 20–30 s. The startup
attempts and `publishRetry` use the same formula. See
[Tuning the reconnect backoff](/en/guide/events/amqp-reliability#tuning-the-reconnect-backoff)
for the formula and a full-jitter recipe.

## Adapter Lifecycle {#adapter-lifecycle}

`lifecycle.onLifecycle` receives one event per connection change: `connected`,
`disconnected`, `reconnecting`, `reconnect-failed`, `setup-failed`, `blocked`, and
`unblocked`. The flat callbacks (`onConnected`, `onDisconnected`, and the others) are
deprecated since 1.3 and kept until at least 2.0. Callbacks must not throw; the adapter
discards their exceptions. See
[Adapter lifecycle](/en/guide/events/amqp-reliability#adapter-lifecycle) and
[`AmqpLifecycleCallbacks`](/en/api/@connectum/events-amqp/types/interfaces/AmqpLifecycleCallbacks).

## Testing {#testing-subpath-exports}

The `@connectum/events-amqp/testing` subpath exports `FakeAmqpAdapter`, an in-memory
adapter with a `control` object that injects publish outcomes, connection drops,
recovery results, setup failures, and flow control. It needs no broker. See
[Testing](/en/guide/events/amqp-reliability#testing-subpath-exports) and
[`FakeAmqpControl`](/en/api/@connectum/events-amqp/testing/interfaces/FakeAmqpControl).

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

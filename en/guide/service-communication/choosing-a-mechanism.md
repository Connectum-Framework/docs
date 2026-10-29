---
title: Choose a Communication Mechanism
description: Choose a call when you need an answer now, or an event when another service can react later.
docType: concept
outline: 2
---

<script setup>
import GuideOverview from '../../../.vitepress/theme/components/GuideOverview.vue';
import overview from '../../../.vitepress/theme/assets/diagrams/guide/mechanisms.html?raw';
</script>

# Choosing a Communication Mechanism

Orders needs to know whether Inventory has stock **before answering** the
customer. That is a service call. After an order is accepted, other services
can react to **what happened** through an event.

<figure class="technical-diagram" data-guide-overview="mechanisms" aria-label="Choose the interaction and its recovery owner">
<GuideOverview :source="overview" />
<figcaption>Calls couple latency and availability; events add delivery and idempotency concerns. Temporal owns durable orchestration outside Connectum. Compensations can fail and do not make service changes atomic.</figcaption>
</figure>

## Choose by the result you need

- **One answer now:** [Service calls](/en/guide/service-communication).
- **A sequence of answers:** [Streaming patterns](/en/guide/service-communication/patterns#server-streaming).
- **A reaction later:** [Events](/en/guide/events).
- **A workflow that survives failure:** [Sagas and compensations](/en/guide/service-communication/mechanisms#durable-a-saga-with-compensations).

Calls couple latency and availability. Events add delivery, ordering and
idempotency concerns. Neither makes a multi-service operation atomic.

## Go deeper

[Compare the full examples and failure trade-offs](/en/guide/service-communication/mechanisms).

<GuideSections route="/en/guide/service-communication/choosing-a-mechanism" />

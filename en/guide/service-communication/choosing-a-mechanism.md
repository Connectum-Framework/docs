---
title: Choose a Communication Mechanism
description: Choose a call when you need an answer now, or an event when another service can react later.
docType: concept
outline: 2
---

# Choosing a Communication Mechanism

Orders needs to know whether Inventory has stock **before answering** the
customer. That is a service call. After an order is accepted, other services
can react to **what happened** through an event.

<figure class="guide-map" aria-label="An order can use both calls and events">
<ol>
<li><strong>Check stock</strong><small>Orders calls Inventory and waits for an answer.</small></li>
<li><strong>Make the decision</strong><small>Orders accepts or rejects the operation.</small></li>
<li><strong>Notify others</strong><small>An event lets subscribers react independently.</small></li>
</ol>
<figcaption>These are different interaction contracts, not competing transport libraries.</figcaption>
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

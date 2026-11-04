---
title: Connectum Runtime Architecture
description: Understand the boundary of one Connectum process before exploring its internal extension seams.
docType: concept
outline: 2
---

<script setup>
import GuideOverview from '../../../.vitepress/theme/components/GuideOverview.vue';
import overview from '../../../.vitepress/theme/assets/diagrams/guide/architecture.html?raw';
</script>

# Connectum Runtime Architecture

Think of Connectum as the inside of one service process, not the whole
deployment platform. `createServer()` composes that process's services,
protocols, middleware and lifecycle.

<figure class="technical-diagram" data-guide-overview="architecture" aria-label="One process and its extension seams">
<GuideOverview :source="overview" />
<figcaption>createServer() owns one process. Catalog, EventBus and OTel are explicit additions; the bus can stay in memory. Protocol HTTP fallbacks sit outside the RPC chain. External infrastructure is selected independently.</figcaption>
</figure>

## Inside and outside

**Inside:** registration, RPC dispatch, request middleware, startup and shutdown.

**Connected explicitly:** EventBus adapters and telemetry instrumentation.

**Outside:** the broker, scheduler, gateway, service mesh and telemetry backend.
You choose those systems independently.

## Go deeper

- [Explore runtime composition, routing and extension diagrams](/en/guide/production/architecture-details).
- [Understand the server boundary](/en/guide/server).
- [Compare local and network calls](/en/guide/production/in-process-transport).
- [Read the architecture decisions](/en/contributing/adr/).

<GuideSections route="/en/guide/production/architecture" />

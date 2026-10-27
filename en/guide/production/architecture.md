---
title: Connectum Runtime Architecture
description: Understand the boundary of one Connectum process before exploring its internal extension seams.
docType: concept
outline: 2
---

# Connectum Runtime Architecture

Think of Connectum as the inside of one service process, not the whole
deployment platform. `createServer()` composes that process's services,
protocols, middleware and lifecycle.

<GuideFlow scene="production/architecture">
<figure class="guide-map" aria-label="The shared application request path">
<ol>
<li><strong>Enter</strong><small>A network or in-process call reaches the registered router.</small></li>
<li><strong>Apply policy</strong><small>Configured admission and server interceptors guard the RPC.</small></li>
<li><strong>Run the handler</strong><small>Your typed implementation handles the request.</small></li>
</ol>
<figcaption>The application path is shared; network-specific behavior still belongs to the transport.</figcaption>
</figure>
</GuideFlow>

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

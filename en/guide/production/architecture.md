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

<figure class="technical-diagram" aria-label="The shared application request path">

```mermaid
flowchart TD
    accTitle: Local and network calls share the application boundary
    accDescr: A network call enters through the transport. An in-process client is already inside the process. Both reach the registered RPC boundary and the typed handler with configured application policy.
    Network["Network client"] -->|transport| Boundary
    subgraph Process["One Connectum process"]
        Local["In-process client"] --> Boundary["RPC boundary<br/>router · admission · interceptors"]
        Boundary --> Handler["Typed handler"]
    end
    class Boundary accent
```

<figcaption>The application path is shared; network-specific behavior still belongs to the transport.</figcaption>
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

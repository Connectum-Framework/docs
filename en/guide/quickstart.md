---
title: Build Your First Connectum Service
description: Scaffold a service, describe a protected page and verify its RPC and operational capabilities.
docType: concept
outline: 2
---

<script setup>
import GuideOverview from '../../.vitepress/theme/components/GuideOverview.vue';
import overview from '../../.vitepress/theme/assets/diagrams/guide/quickstart.html?raw';
import QuickstartShowcase from '../../.vitepress/theme/components/QuickstartShowcase.vue';
</script>

# Build Your First Connectum Service

Start with `init`, describe a protected page in protobuf and add a short handler.
The scaffold provides the server, health checks, reflection and shutdown wiring;
select auth and observability when creating the project.

<QuickstartShowcase />

::: details Build a first RPC manually
<figure class="technical-diagram" data-guide-overview="quickstart" aria-label="Build and verify the first RPC">
<GuideOverview :source="overview" />
<figcaption>grpcurl uses h2c; curl over plaintext HTTP/1.1 requires changing the listener mode and restarting. Verify a greeting and a rejected invalid request before adding TLS, authentication and resilience.</figcaption>
</figure>
:::

## What you will build

A `PageService` returns private content only to an authenticated caller. The
contract owns the access requirement; the handler owns the content. OpenAPI is
generated in a separate step from the same contract and authorization reader.

::: details Prefer a greeting without auth setup?
The complete manual tutorial builds a `GreeterService` that accepts a name and
returns a greeting:

```proto
service GreeterService {
  rpc SayHello(SayHelloRequest) returns (SayHelloResponse);
}
```

This is a contract excerpt. The tutorial supplies both messages, the handler,
server, generation configuration and commands.
:::

## Choose how to start

- **Understand each file:** [Build the service step by step](/en/guide/quickstart-manual).
  Includes installation, Node.js/Bun commands, code generation, a real call,
  validation and troubleshooting.
- **Start from a generated project:** [Scaffold a service](/en/guide/scaffolding).
- **Explore the files first:** [Open the service builder](/en/builder).

Published packages require Node.js **≥22.13.0**. The tutorial's native Node.js
TypeScript path needs **≥25.2.0**; it also shows tsx and Bun alternatives.
See [runtime requirements and limits](/en/guide/runtime-compatibility).

<GuideSections route="/en/guide/quickstart" />

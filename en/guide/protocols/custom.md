---
title: Custom Protocols
description: Add infrastructure RPCs or an HTTP fallback without mixing registration with per-server initialization.
docType: concept
outline: 2
---

<script setup>
import GuideOverview from '../../../.vitepress/theme/components/GuideOverview.vue';
import overview from '../../../.vitepress/theme/assets/diagrams/guide/custom-protocols.html?raw';
</script>

# Creating Custom Protocol Plugins

Most applications need only the built-in Health Check and Reflection modules.
A custom protocol is an extension point for infrastructure RPCs or plain HTTP
endpoints that do not belong in a business service.

<figure class="technical-diagram" data-guide-overview="custom-protocols" aria-label="Custom protocol initialization and routing">
<GuideOverview :source="overview" />
<figcaption>Keep setup idempotent because failed initial materialization can retry it. Create a fresh protocol instance per server. Supported RPC content types receive protocol-aware unimplemented errors; other unmatched requests retain 404.</figcaption>
</figure>

## Keep registration repeatable

Do not put observable side effects in `register()`. Create a fresh protocol
instance for each server, and add it before startup or the first in-process
client materializes routes. If initial materialization fails, setup can run
again on the next attempt.

## Go deeper

- [Implement a protocol, an HTTP handler or a metrics endpoint](/en/guide/protocols/custom-implementation).
- [Use the built-in reflection protocol](/en/guide/protocols/reflection).
- [Use the built-in health protocol](/en/guide/health-checks).

<GuideSections route="/en/guide/protocols/custom" />

---
title: In-Process Transport
description: Call a service on the same server without a socket, while retaining the configured RPC boundary.
docType: concept
outline: 2
---

<script setup>
import GuideOverview from '../../../.vitepress/theme/components/GuideOverview.vue';
import overview from '../../../.vitepress/theme/assets/diagrams/guide/in-process.html?raw';
</script>

# In-Process Transport

Orders and Inventory can run on one `Server`. A local client reaches Inventory
without opening a socket, but still goes through the router and configured
server middleware. It is not a direct call to the handler function.

<figure class="technical-diagram" data-guide-overview="in-process" aria-label="Local calls retain the application boundary">
<GuideOverview :source="overview" />
<figcaption>Local and HTTP clients can coexist. server.client() selects a local service or configured remoteResolver; local tests do not establish wire, TLS or proxy guarantees. The documented 1.3 stop-abort and parked-yield fixes are not yet published.</figcaption>
</figure>

## A local call

With `inventory` registered on `server` and `InventoryService` generated:

```typescript
const client = server.client(InventoryService);
const stock = await client.checkStock({ sku: 'A-1' });
```

A local call needs no `server.start()`. Calling a non-local service needs a
configured resolver. Local tests do not prove TLS, HTTP framing or proxy behavior.

## Go deeper

- [API choices, parity guarantees, cancellation and security limits](/en/guide/production/in-process-transport-details).
- [Watch local and remote routing](/en/guide/service-communication/resolvers).
- [Test the deployed boundary too](/en/guide/testing).

<GuideSections route="/en/guide/production/in-process-transport" />

---
title: Remote Resolvers
description: Follow one call as Inventory moves between processes, then choose how to supply its remote transport.
docType: concept
outline: 2
---

<script setup>
import ResolverWalkthrough from '../../../.vitepress/theme/components/ResolverWalkthrough.vue'
</script>

# Remote Resolvers

Orders knows **what** Inventory can do from its contract. A resolver answers a
different question: **how do I reach Inventory when it is not mounted here?**
It maps the service's protobuf identity to a remote transport.

## Watch one call

Keep the Orders handler unchanged. Switch where Inventory runs to see which
route the server uses.

<ResolverWalkthrough>
<template #call>

```ts
const stock = await ctx.call(
  'shop.v1.InventoryService/CheckStock',
  create(CheckStockRequestSchema, { sku: req.sku }),
);
```

</template>
</ResolverWalkthrough>

::: details Read the scenes without animation
| Scene | Where Inventory is mounted | What the call does |
|---|---|---|
| Together | On the Orders server | Calls the handler in-process. The resolver is not consulted. |
| Separate | On another server, with a configured route | Uses the resolver's gRPC transport. |
| No route | Not on the Orders server; resolver returns `null` | Rejects with `Code.Unavailable`, without calling Inventory. |
:::

## Choose a routing rule

- **Explicit addresses:** `mapResolver` maps each known service to a transport.
- **One upstream:** `singleTransportResolver` sends remote services to one destination.
- **A naming convention:** `dnsResolver` builds URLs from a DNS-style template.
- **Deployment configuration:** `perServiceEnvResolver` reads service URLs from environment variables.

A resolver creates a route, not a health check. It is synchronous and does not
perform network discovery itself. Successful routes are cached; a failed RPC
does not automatically refresh the route or retry the call.

## Go deeper

- [Run the complete six-file example](/en/guide/service-communication/routing-example).
- [Configure resolvers, cache lifetime, endpoint hints and mocks](/en/guide/service-communication/resolver-configuration).
- [Understand where catalog knowledge comes from](/en/guide/service-communication/service-catalog).

<GuideSections route="/en/guide/service-communication/resolvers" />

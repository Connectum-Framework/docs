---
title: In-Process Transport
description: Call a service on the same server without a socket, while retaining the configured RPC boundary.
docType: concept
outline: 2
---

# In-Process Transport

Orders and Inventory can run on one `Server`. A local client reaches Inventory
without opening a socket, but still goes through the router and configured
server middleware. It is not a direct call to the handler function.

<GuideFlow scene="production/in-process-transport">
<figure class="guide-map" aria-label="A local RPC keeps the application boundary">
<ol>
<li><strong>Typed client</strong><small>Orders calls the mounted Inventory contract.</small></li>
<li><strong>In-memory boundary</strong><small>Protobuf is encoded and decoded; no network connection is opened.</small></li>
<li><strong>Registered handler</strong><small>Configured request admission and interceptors still apply.</small></li>
</ol>
<figcaption>Messages are copied through the codec, not shared between caller and handler.</figcaption>
</figure>
</GuideFlow>

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

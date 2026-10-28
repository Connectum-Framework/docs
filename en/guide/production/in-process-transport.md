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

<figure class="technical-diagram" aria-label="A local RPC keeps the application boundary">

```mermaid
flowchart TD
    accTitle: A local RPC still crosses the codec and configured policy
    accDescr: Inside one server, the Orders client exchanges copied protobuf messages with the mounted Inventory RPC through an in-memory codec. The router, configured request admission and interceptors still apply without a network listener.
    subgraph Server["One server · no socket"]
        Orders["Orders client"] -->|request| Codec[["Protobuf codec"]]
        Codec --> Inventory["Inventory RPC<br/>router + middleware"]
        Inventory -->|response| Codec
        Codec --> Orders
    end
    class Codec accent
```

<figcaption>Messages are copied through the codec, not shared between caller and handler.</figcaption>
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

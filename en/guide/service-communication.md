---
title: Service Communication
description: Select synchronous, catalog, in-process, streaming, or event-driven communication by coupling and delivery needs.
docType: concept
outline: deep
---

# Service Communication

Start from the interaction contract, not the transport library. A caller that needs an immediate answer has different failure and coupling requirements from a consumer reacting asynchronously to an event.

## Choose the mechanism

| Need | Canonical route |
|---|---|
| Decide between request/response, streaming, and events | [Choosing a mechanism](/en/guide/service-communication/choosing-a-mechanism) |
| Call generated internal services through `ctx.call` / `ctx.stream` | [Service catalog](/en/guide/service-communication/service-catalog) |
| Select and compose endpoint resolution | [Resolvers](/en/guide/service-communication/resolvers) |
| Add client tracing, deadlines, retry, or credentials | [Client interceptors](/en/guide/service-communication/client-interceptors) |
| Model fan-out, partial failure, or server streaming | [Communication patterns](/en/guide/service-communication/patterns) |
| Keep calls in the same process with transport parity | [In-process transport](/en/guide/production/in-process-transport) |
| React asynchronously through a broker | [Events](/en/guide/events) |

## Synchronous baseline

Use the generated service catalog when services are part of the Connectum contract. It keeps target resolution, propagated request context, deadlines, and typed call names in one boundary. Use a direct ConnectRPC `createClient()` only for an external or deliberately uncatalogued API.

For direct gRPC calls, the transport must support HTTP/2. Client-side resilience belongs around the outgoing transport, and only client-safe interceptors should be composed there. The exact supported set and ordering are owned by [Client interceptors](/en/guide/service-communication/client-interceptors), not repeated on every communication page.

## Operational rule

Synchronous calls couple caller availability and latency to the downstream service. Events decouple time but add delivery, idempotency, ordering, and broker operations. The [mechanism decision guide](/en/guide/service-communication/choosing-a-mechanism) owns that trade-off; the focused pages own implementation details.

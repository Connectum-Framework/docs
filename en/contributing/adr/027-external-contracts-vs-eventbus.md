# ADR-027: External Message Contracts vs the Internal EventBus

## Status

Accepted -- 2026-06-12

## Context

[ADR-026](./026-eventbus-architecture.md) established the EventBus as a proto-first, adapter-based internal event system: `EventBus.publish()` takes a protobuf message, serializes it with `toBinary`, and routes it by proto type. The four adapters (NATS, Kafka, Redis, AMQP) implement a deliberately minimal `EventAdapter` interface that moves opaque `Uint8Array` payloads.

A production adopter then needed to publish to a **partner's** broker under an externally agreed AsyncAPI contract: a named exchange and durable queue, `contentType: application/json`, `deliveryMode=2`, `mandatory`, and per-message publisher confirms. This drove the `events-amqp-external-contract` change, which added adapter-level serialization (`contentType` + `encode`/`decode`), explicit topology declaration, `queueOverrides`, automatic recovery, and reliable publishing to `@connectum/events-amqp`.

That work surfaced a recurring design question that will reappear for every adapter:

- Should the **core** `@connectum/events` interfaces grow to express external-contract variability — per-publish `contentType`, per-subscribe queue names, a `wireFormat: "binary" | "json"` switch on `EventBus`?
- Or do external contracts belong to a different layer than the internal bus?

Without a stated principle, each adapter would answer this differently, and the core interfaces would accrete passthrough options that weaken the typed proto contract.

## Decision

**The EventBus is an internal protobuf bus. External message contracts are served at the adapter layer (or by publishing directly through an adapter), not by extending the core EventBus interfaces.**

Concretely:

1. **`EventBus.publish()` stays protobuf-only.** No `wireFormat` switch is introduced. Putting JSON (or any non-protobuf encoding) on the bus would force every subscriber, middleware, retry, and DLQ path to understand multiple wire formats, and would make `RawEvent.payload` ambiguous. protobuf-es `toJson` only solves the producer side; the consumer side would require format detection (content-sniffing), which the AMQP change already rejected as implicit magic that must fail loudly instead.

2. **External contracts are produced through the adapter.** When an application must emit JSON (or a partner's contentType) against an external contract, it serializes the bytes itself and publishes through the adapter, which controls the wire `contentType` and optional `encode`/`decode` transcoding. This is an outbound producer to a foreign system — it does not need the EventBus's typed routing, middleware, or DLQ.

3. **Core interfaces stay minimal; variability lives in adapter options.** `PublishOptions` / `RawSubscribeOptions` are not extended with generic passthrough bags, declaration merging, or a viral `EventBus<TAdapterOpts>` generic. Contract variability that is genuinely whole-channel (the whole queue is JSON, the whole group reads a named queue) is expressed by adapter-level options (`serialization`, `queueOverrides`, `topology`). A future need for genuine *per-message* variability — if one ever arises with a concrete use case — would be added as typed options on a specific adapter's constructor, not on the core interface.

4. **`PublishOptions.sync` is removed.** It was a no-op across all four adapters: each already confirms publishes per-message (NATS `PubAck`, Kafka `producer.send`, Redis `XADD`, AMQP per-message broker ack with typed errors). A resolved `publish()` already means the broker accepted the message; there was no fire-and-forget mode to opt out of. Removed ahead of the first stable release.

## Consequences

### Positive

- The internal bus keeps one wire format; subscribers, middleware, retry, and DLQ reason about exactly one payload shape.
- Core `EventAdapter` / `PublishOptions` interfaces stay small and typed — no passthrough erosion across four heterogeneous adapters.
- External-contract concerns (content type, topology, confirms, recovery) are isolated to the adapter that actually talks to the foreign broker.

### Negative / Trade-offs

- **Direct adapter publishing bypasses EventBus middleware** (producer-side retry / DLQ). For an external at-least-once producer this is compensated by the adapter's per-message confirms and typed error taxonomy (`AmqpUnroutableError`, `AmqpPublishNackError`, `AmqpPublishTimeoutError`, …), which let the application implement an "advance cursor after confirm" loop. This trade-off must be stated explicitly in the events-amqp guide.
- Per-message wire-format variability is intentionally unsupported. If a real use case appears, it is added per-adapter, not retrofitted into the core interface.

## Alternatives Considered

- **`adapterOptions?: Record<string, unknown>` passthrough on `PublishOptions`** — rejected: kills type safety, silently ignores typos, becomes a junk drawer; contradicts the project's fail-fast discipline.
- **Module augmentation / declaration merging per adapter** — rejected: fragile under tsup `.d.ts` compilation, augmentations from two adapters in one app collide, poor discoverability.
- **Generic `EventBus<TAdapterOpts>`** — rejected: the generic goes viral through `EventBusOptions`, `createServer({ eventBus })`, and middleware for disproportionate cost.
- **`wireFormat: "binary" | "json"` on EventBus** — rejected as an anti-feature (see Decision 1).

## References

- [ADR-026: EventBus Architecture](./026-eventbus-architecture.md)
- [ADR-003: Package Decomposition](./003-package-decomposition.md) (layer rules)
- Change: `events-amqp-external-contract`

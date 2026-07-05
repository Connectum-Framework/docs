[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / EventAdapterFactory

# Type Alias: EventAdapterFactory

> **EventAdapterFactory** = () => [`EventAdapter`](../interfaces/EventAdapter.md)

Defined in: [packages/events/src/types.ts:148](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L148)

A zero-argument factory producing a fresh [EventAdapter](../interfaces/EventAdapter.md).

Used where each consumer needs its OWN broker connection — e.g.
`createBroadcastSubscribers` invokes it once per reactor so every reactor
bus gets an independent connection / durable consumer.

DI guidance: for wiring a service, prefer injecting an `EventAdapter`
INSTANCE (constructed at the composition root) — a test double with its own
configuration does not fit a zero-argument factory signature without a
wrapper closure. Reach for the factory only where per-consumer connections
are the point. Since 1.3.0.

## Returns

[`EventAdapter`](../interfaces/EventAdapter.md)

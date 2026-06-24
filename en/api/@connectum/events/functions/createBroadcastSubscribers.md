[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / createBroadcastSubscribers

# Function: createBroadcastSubscribers()

> **createBroadcastSubscribers**(`options`): [`EventBus`](../types/interfaces/EventBus.md) & `EventBusLike`[]

Defined in: [packages/events/src/broadcast.ts:74](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L74)

Build one `EventBus` per reactor (each with its own consumer group) so a
single published event fans out to ALL reactors independently.

The returned buses are NOT started — start them yourself (e.g.
`await Promise.all(buses.map((b) => b.start()))`) and stop them on shutdown.

Throws if two reactors share a consumer group (that would load-balance / steal
instead of fanning out).

## Parameters

### options

[`BroadcastSubscribersOptions`](../interfaces/BroadcastSubscribersOptions.md)

## Returns

[`EventBus`](../types/interfaces/EventBus.md) & `EventBusLike`[]

## Example

```typescript
const buses = createBroadcastSubscribers({
  adapter: () => new NatsAdapter({ servers, stream: 'orders' }),
  reactors: [
    { group: 'pricing', routes: [pricingRoutes] },
    { group: 'audit',   routes: [auditRoutes] },
    { group: 'notify',  routes: [notifyRoutes] },
  ],
});
await Promise.all(buses.map((bus) => bus.start()));
```

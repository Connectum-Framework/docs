[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / BroadcastReactor

# Interface: BroadcastReactor

Defined in: [packages/events/src/broadcast.ts:23](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L23)

One independent broadcast reactor: its consumer group + routes.

## Properties

### group

> `readonly` **group**: `string`

Defined in: [packages/events/src/broadcast.ts:25](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L25)

Consumer group — MUST be DISTINCT per reactor for true fan-out (a shared group load-balances).

***

### middleware?

> `readonly` `optional` **middleware?**: [`MiddlewareConfig`](../types/interfaces/MiddlewareConfig.md)

Defined in: [packages/events/src/broadcast.ts:29](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L29)

Optional per-reactor middleware (retry/DLQ/custom).

***

### routes

> `readonly` **routes**: [`EventRoute`](../types/type-aliases/EventRoute.md)[]

Defined in: [packages/events/src/broadcast.ts:27](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L27)

The event routes (handlers) this reactor subscribes with.

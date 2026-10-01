[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / BroadcastReactor

# Interface: BroadcastReactor

Defined in: [packages/events/src/broadcast.ts:24](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L24)

One independent broadcast reactor: its consumer group + routes.

## Properties

### group

> `readonly` **group**: `string`

Defined in: [packages/events/src/broadcast.ts:26](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L26)

Consumer group — MUST be DISTINCT per reactor for true fan-out (a shared group load-balances).

***

### middleware?

> `readonly` `optional` **middleware?**: [`MiddlewareConfig`](../types/interfaces/MiddlewareConfig.md)

Defined in: [packages/events/src/broadcast.ts:30](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L30)

Optional per-reactor middleware (retry/DLQ/custom).

***

### routes

> `readonly` **routes**: [`EventRoute`](../types/type-aliases/EventRoute.md)[]

Defined in: [packages/events/src/broadcast.ts:28](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L28)

The event routes (handlers) this reactor subscribes with.

[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / BroadcastSubscribersOptions

# Interface: BroadcastSubscribersOptions

Defined in: [packages/events/src/broadcast.ts:33](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L33)

Options for [createBroadcastSubscribers](../functions/createBroadcastSubscribers.md).

## Properties

### adapter

> `readonly` **adapter**: [`EventAdapter`](../types/interfaces/EventAdapter.md) \| (() => [`EventAdapter`](../types/interfaces/EventAdapter.md))

Defined in: [packages/events/src/broadcast.ts:40](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L40)

The broker adapter. Pass ONE shared instance (fine for `MemoryAdapter` in
tests, where all buses share the in-memory registry) OR a factory invoked
once per reactor (use this for real brokers so each reactor bus gets its
own connection / durable consumer).

***

### drainTimeout?

> `readonly` `optional` **drainTimeout?**: `number`

Defined in: [packages/events/src/broadcast.ts:46](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L46)

Shared per-bus drain timeout (ms).

***

### handlerTimeout?

> `readonly` `optional` **handlerTimeout?**: `number`

Defined in: [packages/events/src/broadcast.ts:44](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L44)

Shared per-bus handler timeout (ms).

***

### reactors

> `readonly` **reactors**: [`BroadcastReactor`](BroadcastReactor.md)[]

Defined in: [packages/events/src/broadcast.ts:42](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L42)

The independent reactors — each becomes its own EventBus with its own group.

***

### signal?

> `readonly` `optional` **signal?**: `AbortSignal`

Defined in: [packages/events/src/broadcast.ts:48](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L48)

Shared abort signal for graceful shutdown.

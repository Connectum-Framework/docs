[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / BroadcastSubscribersOptions

# Interface: BroadcastSubscribersOptions

Defined in: [packages/events/src/broadcast.ts:34](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L34)

Options for [createBroadcastSubscribers](../functions/createBroadcastSubscribers.md).

## Properties

### adapter

> `readonly` **adapter**: [`EventAdapter`](../types/interfaces/EventAdapter.md) \| [`EventAdapterFactory`](../types/type-aliases/EventAdapterFactory.md)

Defined in: [packages/events/src/broadcast.ts:41](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L41)

The broker adapter. Pass ONE shared instance (fine for `MemoryAdapter` in
tests, where all buses share the in-memory registry) OR a factory invoked
once per reactor (use this for real brokers so each reactor bus gets its
own connection / durable consumer).

***

### drainPublishTimeout?

> `readonly` `optional` **drainPublishTimeout?**: `number`

Defined in: [packages/events/src/broadcast.ts:49](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L49)

Shared per-bus opt-in publish drain budget at `stop()` (ms). Since 1.3.0.

***

### drainTimeout?

> `readonly` `optional` **drainTimeout?**: `number`

Defined in: [packages/events/src/broadcast.ts:47](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L47)

Shared per-bus drain timeout (ms).

***

### handlerTimeout?

> `readonly` `optional` **handlerTimeout?**: `number`

Defined in: [packages/events/src/broadcast.ts:45](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L45)

Shared per-bus handler timeout (ms).

***

### reactors

> `readonly` **reactors**: [`BroadcastReactor`](BroadcastReactor.md)[]

Defined in: [packages/events/src/broadcast.ts:43](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L43)

The independent reactors — each becomes its own EventBus with its own group.

***

### signal?

> `readonly` `optional` **signal?**: `AbortSignal`

Defined in: [packages/events/src/broadcast.ts:51](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/broadcast.ts#L51)

Shared abort signal for graceful shutdown.

[Connectum API Reference](../../../../index.md) / [@connectum/events-nats](../../index.md) / [types](../index.md) / NatsLifecycleCallbacks

# Interface: NatsLifecycleCallbacks

Defined in: [types.ts:117](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-nats/src/types.ts#L117)

Callbacks for the connection lifecycle of the NATS adapter.

## Properties

### onLifecycle?

> `readonly` `optional` **onLifecycle?**: (`event`) => `void` \| `Promise`\<`void`\>

Defined in: [types.ts:125](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-nats/src/types.ts#L125)

Called for every [NatsLifecycleEvent](../type-aliases/NatsLifecycleEvent.md). It should not throw: a thrown exception or a rejected
returned promise is isolated and reported as a `lifecycle-error` event, and a failure while handling
that one is dropped. A returned promise is not awaited.

Events of the initial dial that happen before `connect()` returns are not available from the client.

#### Parameters

##### event

[`NatsLifecycleEvent`](../type-aliases/NatsLifecycleEvent.md)

#### Returns

`void` \| `Promise`\<`void`\>

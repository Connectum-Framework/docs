[Connectum API Reference](../../../../index.md) / [@connectum/events-redis](../../index.md) / [types](../index.md) / RedisLifecycleCallbacks

# Interface: RedisLifecycleCallbacks

Defined in: [types.ts:121](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-redis/src/types.ts#L121)

Callbacks for the connection lifecycle of the Redis adapter.

## Properties

### onLifecycle?

> `readonly` `optional` **onLifecycle?**: (`event`) => `void` \| `Promise`\<`void`\>

Defined in: [types.ts:130](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-redis/src/types.ts#L130)

Called for every [RedisLifecycleEvent](../type-aliases/RedisLifecycleEvent.md). It should not throw: a thrown exception or a
rejected returned promise is isolated and reported as a `lifecycle-error` event, and a failure
while handling that one is dropped. A returned promise is not awaited.

Setting it attaches an `error` listener to every connection, which replaces the client's own
"Unhandled error event" line on stderr; the cause is carried by the `error` field of the events instead.

#### Parameters

##### event

[`RedisLifecycleEvent`](../type-aliases/RedisLifecycleEvent.md)

#### Returns

`void` \| `Promise`\<`void`\>

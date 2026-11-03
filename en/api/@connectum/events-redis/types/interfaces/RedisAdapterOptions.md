[Connectum API Reference](../../../../index.md) / [@connectum/events-redis](../../index.md) / [types](../index.md) / RedisAdapterOptions

# Interface: RedisAdapterOptions

Defined in: [types.ts:12](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-redis/src/types.ts#L12)

Options for creating a Redis Streams adapter.

## Properties

### brokerOptions?

> `readonly` `optional` **brokerOptions?**: [`RedisBrokerOptions`](RedisBrokerOptions.md)

Defined in: [types.ts:37](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-redis/src/types.ts#L37)

Broker-specific tuning for Redis Streams consumption.

***

### lifecycle?

> `readonly` `optional` **lifecycle?**: [`RedisLifecycleCallbacks`](RedisLifecycleCallbacks.md)

Defined in: [types.ts:40](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-redis/src/types.ts#L40)

Connection lifecycle callback. Without it the adapter attaches no listener to the clients and behaves as before.

***

### redisOptions?

> `readonly` `optional` **redisOptions?**: `RedisOptions`

Defined in: [types.ts:32](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-redis/src/types.ts#L32)

Redis connection options (alternative to `url`).

Passed directly to `new Redis(redisOptions)`.
When `url` is also set, these options are merged as the second argument.

`connectTimeout` (ioredis default 10000 ms) also bounds the wait for a connection to become
ready: `connect()` and `subscribe()` reject with an error when the server accepts the TCP
connection but does not complete the handshake in time. A value of `0` or less removes the
deadline.

***

### url?

> `readonly` `optional` **url?**: `string`

Defined in: [types.ts:19](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-redis/src/types.ts#L19)

Redis connection URL (e.g., "redis://localhost:6379").

Takes precedence over `redisOptions.host` / `redisOptions.port`
when both are provided.

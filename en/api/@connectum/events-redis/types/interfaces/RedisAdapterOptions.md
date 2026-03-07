[Connectum API Reference](../../../../index.md) / [@connectum/events-redis](../../index.md) / [types](../index.md) / RedisAdapterOptions

# Interface: RedisAdapterOptions

Defined in: [types.ts:12](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events-redis/src/types.ts#L12)

Options for creating a Redis Streams adapter.

## Properties

### brokerOptions?

> `readonly` `optional` **brokerOptions**: [`RedisBrokerOptions`](RedisBrokerOptions.md)

Defined in: [types.ts:32](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events-redis/src/types.ts#L32)

Broker-specific tuning for Redis Streams consumption.

***

### redisOptions?

> `readonly` `optional` **redisOptions**: `RedisOptions`

Defined in: [types.ts:27](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events-redis/src/types.ts#L27)

Redis connection options (alternative to `url`).

Passed directly to `new Redis(redisOptions)`.
When `url` is also set, these options are merged as the second argument.

***

### url?

> `readonly` `optional` **url**: `string`

Defined in: [types.ts:19](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events-redis/src/types.ts#L19)

Redis connection URL (e.g., "redis://localhost:6379").

Takes precedence over `redisOptions.host` / `redisOptions.port`
when both are provided.

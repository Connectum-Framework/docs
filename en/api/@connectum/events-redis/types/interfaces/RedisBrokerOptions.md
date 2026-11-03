[Connectum API Reference](../../../../index.md) / [@connectum/events-redis](../../index.md) / [types](../index.md) / RedisBrokerOptions

# Interface: RedisBrokerOptions

Defined in: [types.ts:46](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-redis/src/types.ts#L46)

Redis Streams broker tuning options.

## Properties

### blockMs?

> `readonly` `optional` **blockMs?**: `number`

Defined in: [types.ts:69](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-redis/src/types.ts#L69)

Block timeout in milliseconds for XREADGROUP.

How long the consumer blocks waiting for new messages
before retrying the loop.
Must be a non-negative safe integer. `0` blocks without a deadline (Redis `BLOCK 0`), so the
stale-entry reclaim pass only runs after a message arrives.

#### Default

```ts
5000
```

#### Throws

From `RedisAdapter()` when the value is not a non-negative safe integer.

***

### count?

> `readonly` `optional` **count?**: `number`

Defined in: [types.ts:78](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-redis/src/types.ts#L78)

Number of messages to read per XREADGROUP call.
Must be a positive safe integer.

#### Default

```ts
10
```

#### Throws

From `RedisAdapter()` when the value is not a positive safe integer.

***

### maxLen?

> `readonly` `optional` **maxLen?**: `number`

Defined in: [types.ts:56](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-redis/src/types.ts#L56)

Maximum stream length (MAXLEN approximate for XADD).

When set, older entries are trimmed on publish.
Must be a positive safe integer: `0` would trim every entry on publish, so it is rejected.

#### Default

```ts
undefined (no limit)
```

#### Throws

From `RedisAdapter()` when the value is not a positive safe integer.

---
title: Redis Adapter Options Are Validated
description: From 1.3.0, RedisAdapter() rejects invalid brokerOptions, a silent server fails connect() after connectTimeout, and a lost consumer group is re-created.
docType: migration
---

# Redis Adapter Options Are Validated

> Applies to `@connectum/events-redis` 1.3.0.

## Does this apply to you?

You need to act in three cases:

- You pass `brokerOptions` with a `maxLen` that is not a positive safe integer, a `blockMs` that is not a non-negative safe integer, or a `count` that is not a positive safe integer. `RedisAdapter()` now throws a `RangeError` that names the option and the value. Before, `maxLen: 0` made every publish trim the entry it had just written, so events vanished without an error, and an invalid `blockMs` or `count` started and then failed every second in the consume loop so that nothing was delivered.
- Your Redis server needs longer than `redisOptions.connectTimeout` (10000 ms unless you set it) to become ready after the TCP connection, for example because of a slow TLS or AUTH handshake. `connect()` and `subscribe()` now reject with `RedisAdapter: connection not ready within N ms (redisOptions.connectTimeout)`. Before, they waited as long as the handshake took, and forever if it never finished.
- You switch exhaustively over `RedisLifecycleEvent` without a default branch. The union has a new member, `group-recreated`.

If none of these applies, nothing changes.

## Required changes

- **`maxLen: 0`.** Remove the option to keep every entry, or set the stream length you want to retain. `0` never meant "no limit".
- **A `blockMs` or `count` that is fractional, `NaN`, a string or negative.** Pass a whole number. `blockMs: 0` is valid and blocks without a deadline (Redis `BLOCK 0`).
- **A slow handshake.** Raise `redisOptions.connectTimeout`, or set it to `0` to remove the deadline.
- **An exhaustive `switch`.** Add a branch for `group-recreated`, or a default branch.

```typescript
// Before: accepted, and published events were trimmed away at once
RedisAdapter({ url, brokerOptions: { maxLen: 0 } });

// After: keep roughly the latest 100000 entries
RedisAdapter({ url, brokerOptions: { maxLen: 100_000 } });
```

## Behavior that changed without an option

When Redis loses a consumer group (restart without persistence, `FLUSHALL`, failover to a replica without the stream), the consumer now creates the group again and resumes. Before, it logged `NOGROUP` every second and delivered nothing until the service restarted. The new group starts at the beginning of the stream, so entries the old group had already handled can be delivered a second time. See [Recovery after Redis loses a consumer group](/en/guide/events/adapters#redis-group-recovery).

## Verify the upgrade

Create the adapter in a startup test: an invalid option throws at that call. Point `connect()` at a port that accepts connections and stays silent and check that it rejects after `connectTimeout`.

## Related

- [Redis Streams or Valkey adapter](/en/guide/events/adapters#redis-streams-adapter)

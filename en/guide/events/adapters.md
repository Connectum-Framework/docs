---
title: Choose an Event Adapter
description: Compare Connectum event brokers, choose one for the workload, and reach its exact configuration API.
docType: concept
outline: deep
---

# Choose an Event Adapter

Every Connectum EventBus uses the same `EventAdapter` contract. Choose a broker
from workload and operational requirements, then keep broker-specific tuning in
that adapter's generated API reference.

## Broker Selection Matrix {#adapter-comparison}

| Adapter | Persistence | Consumer coordination | Ordering scope | Best starting fit |
|---|---|---|---|---|
| Memory | No | None | Publish call | Unit tests and local prototypes |
| NATS JetStream | Yes | Durable consumers | Subject | Lightweight, low-latency service events |
| Kafka / Redpanda | Yes | Native consumer groups | Partition | High-throughput streams and retained logs |
| Redis Streams / Valkey | Configurable by Redis | Consumer groups | Stream | Teams already operating Redis-compatible infrastructure |
| AMQP / RabbitMQ / LavinMQ | Durable queues/exchanges when configured | Competing consumers | Queue | Routing topologies and external AMQP contracts |

All production adapters implement at-least-once delivery semantics. Handlers must
be idempotent and acknowledge only after their side effects are complete. Broker
configuration determines actual durability and retention.

## Memory {#memory-adapter}

`MemoryAdapter()` ships with `@connectum/events`. It has no external dependency,
persistence, or consumer groups and is intended for tests and local development.

```typescript
import { MemoryAdapter } from '@connectum/events';

const adapter = MemoryAdapter();
```

## NATS JetStream {#nats-jetstream-adapter}

Choose NATS for durable subjects, wildcard routing, and a compact operational
footprint.

```typescript
import { NatsAdapter } from '@connectum/events-nats';

const adapter = NatsAdapter({ servers: 'nats://localhost:4222' });
```

- [Module hub](/en/packages/events-nats)
- [`NatsAdapterOptions`](/en/api/@connectum/events-nats/types/interfaces/NatsAdapterOptions)

### Overlapping patterns {#nats-overlapping-patterns}

A subscription that lists patterns matching the same subject (`orders.created`,
`orders.*`, `orders.>`) runs its handler once per event. The adapter creates
consumers for the patterns that remain after dropping every pattern another one
contains, so the three patterns above share the consumer of `orders.>`. Patterns
that overlap with nothing keep their own consumer and name. Two patterns that
overlap only in part (`a.*.c` and `a.b.*`) are replaced by one wider pattern
(`a.>`), and the adapter acknowledges and skips events that match none of the
patterns you asked for.

Upgrading from a version that created one consumer per pattern leaves the
consumers of the dropped patterns on the broker. The adapter does not delete
them, because other instances of the group may still run the old version. Once
every instance is upgraded, list them with `nats consumer ls <stream>` and
remove the ones named `{group}--{pattern}--{hash}` for the dropped patterns
(`nats consumer rm <stream> <name>`). Until then their pending count grows with
every event, and on a stream with `interest` retention they keep every message
in the stream.

When the consumer that stays was one of the old ones (`orders.>` above), it
resumes from its position and receives everything the dropped ones would have.
When the covering pattern had no consumer before, its consumer is new and starts
at `consumerOptions.deliverPolicy` (`"new"` by default). That happens when a
broader route is added to a service that had only the narrower one, and for the
wider pattern that replaces two partly overlapping ones. Events published but
not yet consumed by the dropped consumers when the subscription restarts are
then not delivered. For such a service let the old consumers drain
(`num_pending` is `0` in `nats consumer info <stream> <name>`) before upgrading,
or accept that window. Rolling back is possible: the old consumers still exist
unless you removed them and resume where they stopped, so events the new version
already handled are delivered to the old one again; if they were removed, the old
version creates them anew.

## Kafka or Redpanda {#kafka-adapter}

Choose Kafka-compatible infrastructure for partitioned ordering, retained logs,
and high-throughput stream processing.

```typescript
import { KafkaAdapter } from '@connectum/events-kafka';

const adapter = KafkaAdapter({
  brokers: ['localhost:9092'],
  clientId: 'orders-service',
});
```

### Acknowledgement and redelivery {#kafka-ack-redelivery}

Delivery is at-least-once. The adapter commits a partition offset only from the
handler's outcome, never from a client timer:

| Handler outcome | Offset | What happens next |
|---|---|---|
| `ack()` (EventBus calls it after a successful handler) | committed | next message |
| `nack(false)` | committed | message is skipped; `nack(false)` itself publishes no DLQ copy |
| `nack(true)` or `nack()` | not committed | the message and the rest of the batch are delivered again, in order |
| handler throws while the message is still uncommitted | not committed | same as `nack(true)`; the error is logged with topic, partition and offset |
| handler throws after `ack()` or `nack(false)` committed the offset | committed | the message is not redelivered; the error is still logged with topic, partition and offset |
| adapter used directly, handler returns without settling | not committed | same as `nack(true)` |

Through the EventBus a handler that returns normally without settling is
acknowledged automatically, so call `nack(true)` when the message must be
redelivered. The DLQ middleware publishes a copy only when the handler throws; it
then acknowledges the original, so a message the DLQ middleware moved is not
redelivered.

A Kafka offset means "everything before it is consumed", so settlement is
ordered: the first message that is not committed ends the batch and is the first
one fetched again. The first settlement of a message wins; an `ack()` called
after the handler returned is ignored.

An unsettled message is delivered again after `consumerOptions.redeliveryDelay`
milliseconds (default `1000`): the adapter pauses the partition for that long.
`0` redelivers immediately, so a handler that fails permanently retries in a
tight loop and writes one log line per attempt. The maximum is `2147483647`.
On an otherwise idle consumer the observed gap is a whole fetch cycle (5 s in
KafkaJS) even for smaller values.

::: warning A message that always fails blocks its partition
Nothing behind a message that fails on every delivery is delivered until the
handler succeeds, `nack(false)` is called, or the DLQ middleware moves it.
`redeliveryDelay` only paces the loop; it does not end it. Bound a permanently
failing message with the retry and DLQ [middleware](/en/guide/events/middleware).
:::

`attempt` is always `1` on Kafka: the broker does not count deliveries.

### Commit strategy {#kafka-commit-strategy}

By default every acknowledged message is committed by its own `OffsetCommit`
request, so a batch of 20 acknowledged messages costs 20 requests to the group
coordinator. `consumerOptions.commitStrategy` changes when the commit is sent:

| Value | `OffsetCommit` requests | `await ack()` returns |
|---|---|---|
| `"per-message"` (default) | one for every acknowledged message | after the broker accepted the commit |
| `"per-batch"` | one for the last acknowledged message of the batch | at once, nothing is sent yet |

```typescript
const adapter = KafkaAdapter({
  brokers: ['localhost:9092'],
  consumerOptions: { commitStrategy: 'per-batch' },
});
```

With `"per-batch"` the commit is sent when the adapter stops working on the batch,
and it is sent on every way that can happen: the end of the batch, a message
that is requeued with `nack(true)` or returned without settling, a handler that
throws, the consumer being stopped, and a lost group membership (a failed
heartbeat). What was acknowledged is committed in each of these cases; a message
that was not acknowledged is never committed, so the ordering rules above are
the same in both modes. If the commit for a batch that otherwise ended normally
fails, the failure reaches KafkaJS like any other commit failure. If it fails
after the batch ended with an error, the original error is the one that reaches
KafkaJS and the commit failure is logged.

::: warning Wider window of duplicates
With `"per-batch"` an acknowledgement is not durable until the batch ends. If the
process dies, or the broker refuses the commit, between an `ack()` and the end of
the batch, every message acknowledged in that batch is delivered again, up to the
size of the batch, instead of at most one. Handlers must be idempotent. A
dead-letter copy published before the original is acknowledged can also be
published twice. Delivery stays at-least-once.
:::

How many requests `"per-batch"` saves depends on how many messages KafkaJS returns
in one fetch, not on a setting of the adapter. When a batch holds a single
message, both modes send the same one request.

### Long-running handlers {#kafka-long-handlers}

While a handler runs, the adapter keeps sending group heartbeats on its behalf, so
a handler that takes longer than `consumerOptions.sessionTimeout` (default `30000`
ms) stays a member of its group: its `ack()` is accepted and the message is
delivered once. The adapter beats every 3 seconds (the KafkaJS default
`heartbeatInterval`), checking twice per interval, and stops as soon as the handler
returns, throws, or its turn ends.

If a heartbeat fails (the broker removed the member or started a rebalance) and the
message was not committed, the adapter hands the error to KafkaJS so the consumer
rejoins the group instead of redelivering on a membership the broker no longer
recognises; the message is delivered again after the rejoin. A message whose
offset was already committed stays committed.

The handler is never cancelled by the adapter: the EventBus only aborts `ctx.signal`
after `handlerTimeout` (default `30000` ms), and a handler that ignores that signal
and never returns holds its place in the group indefinitely. Make long handlers
honour `ctx.signal`.

### Start position {#kafka-start-position}

A consumer group with no committed offset starts at the end of the topic
(`consumerOptions.fromBeginning: false`, the default), so messages published
before the group first commits an offset are not delivered. Once the group has
committed, messages published while it is stopped are delivered on restart. Set
`fromBeginning: true` to read a topic's history with a new group.

### Wildcard subscriptions {#kafka-wildcards}

`*` and `>` are converted to a regular expression over topic names. Two
properties differ from NATS:

- A pattern that **opens with a wildcard** never matches topics whose name starts
  with `__`, the prefix Kafka uses for its own topics (`__consumer_offsets`,
  `__transaction_state`). Without that, a catch-all `>` would feed the broker's
  binary bookkeeping records to your handler. A pattern that spells the prefix
  out (`__audit.>`), a literal topic name and names with a single leading
  underscore are unaffected.
- The topics a wildcard stands for are fixed when `subscribe()` runs. A matching
  topic created afterwards is not consumed by that subscription. Create the topics
  before the service starts, restart the service after creating them, or set
  `consumerOptions.topicDiscoveryInterval` (milliseconds): the adapter then lists
  the broker's topics at that interval and, when a matching topic has appeared,
  restarts the subscription's consumer to include it. The restart rebalances the
  consumer group, so consumption pauses for a few seconds and messages being
  handled at that moment are delivered again; it happens only when there is a new
  topic, and an unchanged topic list costs one metadata request per wildcard
  subscription per interval. A discovered topic is read from its first message,
  whatever `fromBeginning` says.

### Related

- [Module hub](/en/packages/events-kafka)
- [`KafkaAdapterOptions`](/en/api/@connectum/events-kafka/types/interfaces/KafkaAdapterOptions)
- [Redpanda example](https://github.com/Connectum-Framework/examples/tree/main/with-events-redpanda)

## Redis Streams or Valkey {#redis-streams-adapter}

Choose Redis Streams when the team already operates Redis-compatible
infrastructure and needs stream consumer groups without a separate broker stack.

```typescript
import { RedisAdapter } from '@connectum/events-redis';

const adapter = RedisAdapter({ url: 'redis://localhost:6379' });
```

The adapter speaks RESP2 unless you opt into RESP3 through `redisOptions`; see
[Redis protocol](/en/packages/events-redis#redis-protocol).

### Redelivery of pending entries {#redis-redelivery}

An entry that is not acknowledged stays in the consumer group's pending list:
`nack(true)` or `nack()` leaves it there, and so does a handler that throws
before the entry is settled. `nack(false)` acknowledges it, so it is not
redelivered. The adapter claims pending entries that have been idle for 30
seconds (`XAUTOCLAIM`) and delivers them again with the delivery count from the
group.

A handler failure on one redelivered entry is logged with the entry id and
affects only that entry: it stays pending and is claimed again after another 30
seconds, while the other entries claimed in the same pass are still delivered.
`XAUTOCLAIM` inspects a limited number of pending entries per call, so the
adapter continues each pass where the previous one stopped; entries behind a
long run of recently delivered ones are therefore reached too.

### Wildcards are not supported {#redis-wildcards}

Redis Streams has no pattern subscription. A topic containing `*` or `>` is
rejected when the subscription is made, so `bus.start()` fails with
`RedisAdapter: wildcard pattern "..." is not supported. Redis Streams requires explicit topic names.`
Subscribe to each topic by its exact name, or use the NATS, Kafka or AMQP adapter
when you need wildcard routing.

### Related

- [Module hub](/en/packages/events-redis)
- [`RedisAdapterOptions`](/en/api/@connectum/events-redis/types/interfaces/RedisAdapterOptions)

## AMQP or RabbitMQ {#amqp--rabbitmq-adapter}

Choose AMQP for exchange/queue topology, competing consumers, or integration
with an externally governed AMQP contract.

```typescript
import { AmqpAdapter } from '@connectum/events-amqp';

const adapter = AmqpAdapter({
  url: 'amqp://localhost:5672',
  exchange: 'events',
  exchangeType: 'topic',
});
```

- [Module hub](/en/packages/events-amqp)
- [Run the AMQP adapter reliably](/en/guide/events/amqp-reliability) — publish retry, recovery, lifecycle, and broker-free tests
- [`AmqpAdapterOptions`](/en/api/@connectum/events-amqp/types/interfaces/AmqpAdapterOptions)
- [AMQP example](https://github.com/Connectum-Framework/examples/tree/main/with-events-amqp)

## Automatic Client Identification

When an adapter-specific client or connection name is not supplied, the EventBus
derives a service identifier from registered proto service names and the host.
An explicit adapter option always wins. Use explicit names when broker ACLs,
dashboards, or support procedures depend on stable identifiers.

## Adapter Instances and Factories {#adapter-factory}

`createEventBus()` takes an adapter **instance**. Construct it once at the
composition root and pass it in. This is also how tests replace the broker:
inject `MemoryAdapter()` or another configured test double instead of the
production adapter.

```typescript
import { createEventBus, type EventAdapter } from '@connectum/events';

export function createOrdersBus(adapter: EventAdapter) {
  return createEventBus({ adapter, routes: [orderEvents], group: 'orders-service' });
}

// Production: createOrdersBus(NatsAdapter({ servers: 'nats://localhost:4222', stream: 'orders' }))
// Tests:      createOrdersBus(MemoryAdapter())
```

Use an `EventAdapterFactory` -- a zero-argument function that returns a new
adapter -- only when each consumer needs its own broker connection. Since 1.3.0
it is the named type of the `adapter` option of `createBroadcastSubscribers`,
which accepts either one shared instance or a factory. With a factory,
`createBroadcastSubscribers` calls it once per reactor when it builds the buses,
so every reactor gets an independent connection and consumer group:

```typescript
import { createBroadcastSubscribers, type EventAdapterFactory } from '@connectum/events';
import { NatsAdapter } from '@connectum/events-nats';

const newAdapter: EventAdapterFactory = () =>
  NatsAdapter({ servers: 'nats://localhost:4222', stream: 'orders' });

const buses = createBroadcastSubscribers({
  adapter: newAdapter,
  reactors: [
    { group: 'pricing', routes: [pricingRoutes] },
    { group: 'audit', routes: [auditRoutes] },
  ],
});

await Promise.all(buses.map((bus) => bus.start()));
```

The returned buses are not started, and you stop them yourself on shutdown.
Two reactors with the same `group` make `createBroadcastSubscribers` throw,
because a shared group load-balances events instead of delivering each event to
every reactor. Passing one shared instance instead fits `MemoryAdapter` in
tests: every bus then publishes and subscribes through the same in-memory
adapter. Stop those buses together, because stopping any one of them
disconnects the shared adapter and removes the subscriptions of all the others.

- [`EventAdapterFactory`](/en/api/@connectum/events/types/type-aliases/EventAdapterFactory)
- [`BroadcastSubscribersOptions`](/en/api/@connectum/events/interfaces/BroadcastSubscribersOptions)

## Custom Adapters {#eventadapter-interface}

Implement the generated [`EventAdapter`](/en/api/@connectum/events/types/interfaces/EventAdapter)
contract when a broker is not covered. Keep serialization, connection lifecycle,
subscription cancellation, acknowledgement behavior, and error semantics explicit.

## Next Steps

- [Publish and Subscribe](/en/guide/events/getting-started)
- [Event Middleware](/en/guide/events/middleware)
- [`@connectum/events`](/en/packages/events)

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

### Start position {#kafka-start-position}

A consumer group with no committed offset starts at the end of the topic
(`consumerOptions.fromBeginning: false`, the default), so messages published
before the group first commits an offset are not delivered. Once the group has
committed, messages published while it is stopped are delivered on restart. Set
`fromBeginning: true` to read a topic's history with a new group.

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

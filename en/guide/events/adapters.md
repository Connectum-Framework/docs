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
- [`AmqpAdapterOptions`](/en/api/@connectum/events-amqp/types/interfaces/AmqpAdapterOptions)
- [AMQP example](https://github.com/Connectum-Framework/examples/tree/main/with-events-amqp)

## Automatic Client Identification

When an adapter-specific client or connection name is not supplied, the EventBus
derives a service identifier from registered proto service names and the host.
An explicit adapter option always wins. Use explicit names when broker ACLs,
dashboards, or support procedures depend on stable identifiers.

## Custom Adapters {#eventadapter-interface}

Implement the generated [`EventAdapter`](/en/api/@connectum/events/types/interfaces/EventAdapter)
contract when a broker is not covered. Keep serialization, connection lifecycle,
subscription cancellation, acknowledgement behavior, and error semantics explicit.

## Next Steps

- [Publish and Subscribe](/en/guide/events/getting-started)
- [Event Middleware](/en/guide/events/middleware)
- [`@connectum/events`](/en/packages/events)

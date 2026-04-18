---
outline: deep
---

# Events

Connectum EventBus provides event-driven communication between microservices with proto-first routing, pluggable broker adapters, and a composable middleware pipeline.

## Architecture

```mermaid
graph LR
    subgraph Service A
        HA["Event Handler A"]
        PA["eventBus.publish()"]
    end

    subgraph EventBus
        R["EventRouter"]
        MW["Middleware Pipeline"]
        AD["EventAdapter"]
    end

    subgraph Broker["Message Broker"]
        T1["Topic 1"]
        T2["Topic 2"]
    end

    subgraph Service B
        HB["Event Handler B"]
        PB["eventBus.publish()"]
    end

    PA -->|"publish(Schema, data)"| AD
    AD --> T1
    AD --> T2
    T1 --> AD
    T2 --> AD
    AD --> MW
    MW --> R
    R --> HA

    PB -->|"publish(Schema, data)"| AD
    AD --> HB
```

The EventBus sits between your service handlers and the message broker. It handles:

- **Serialization** -- automatically serializes/deserializes protobuf messages
- **Routing** -- maps proto service methods to topic subscriptions
- **Middleware** -- applies retry, DLQ, and custom middleware to every event
- **Lifecycle** -- manages adapter connect/disconnect with the server, graceful drain on shutdown

## Core Concepts

### Proto-First Routing

Event handlers are defined as proto services, mirroring ConnectRPC's `ConnectRouter` pattern. Each handler method receives a typed protobuf message and an `EventContext`:

```protobuf
// proto/orders/v1/events.proto
service OrderEventHandlers {
  rpc OnOrderCreated(OrderCreated) returns (google.protobuf.Empty);
  rpc OnOrderCancelled(OrderCancelled) returns (google.protobuf.Empty);
}
```

```typescript
import type { EventRoute } from '@connectum/events';
import { OrderEventHandlers } from '#gen/orders/v1/events_pb.js';

const orderEvents: EventRoute = (events) => {
  events.service(OrderEventHandlers, {
    onOrderCreated: async (msg, ctx) => {
      console.log(`Order ${msg.orderId} created`);
      await ctx.ack();
    },
    onOrderCancelled: async (msg, ctx) => {
      console.log(`Order ${msg.orderId} cancelled`);
      await ctx.ack();
    },
  });
};
```

### Adapter Pattern

The `EventAdapter` interface abstracts away broker-specific details. Adapters handle connection management, message serialization at the wire level, and subscription lifecycle. Broker-specific configuration (credentials, tuning, stream names) is passed to the adapter constructor:

```typescript
// NATS JetStream
import { NatsAdapter } from '@connectum/events-nats';
const adapter = NatsAdapter({ servers: 'nats://localhost:4222', stream: 'orders' });

// Kafka / Redpanda
import { KafkaAdapter } from '@connectum/events-kafka';
const adapter = KafkaAdapter({ brokers: ['localhost:9092'], clientId: 'my-service' });

// Redis Streams / Valkey
import { RedisAdapter } from '@connectum/events-redis';
const adapter = RedisAdapter({ url: 'redis://localhost:6379' });

// AMQP / RabbitMQ / LavinMQ
import { AmqpAdapter } from '@connectum/events-amqp';
const adapter = AmqpAdapter({ url: 'amqp://localhost:5672' });

// In-memory (testing)
import { MemoryAdapter } from '@connectum/events';
const adapter = MemoryAdapter();
```

### Middleware Pipeline

Middleware wraps event handlers in an onion model. Built-in middleware provides retry with configurable backoff and dead letter queue routing:

```
Custom → DLQ → Retry → Handler
```

Each middleware receives the raw event, the event context, and a `next()` function to call the inner handler.

### EventContext

Every event handler receives an `EventContext` with explicit acknowledgment control:

| Property | Description |
|----------|-------------|
| `eventId` | Unique event identifier |
| `eventType` | Topic / event type name |
| `publishedAt` | Publish timestamp |
| `attempt` | Delivery attempt number (1-based) |
| `metadata` | Event headers as `ReadonlyMap<string, string>` |
| `signal` | `AbortSignal` -- aborted on server shutdown |
| `ack()` | Acknowledge successful processing |
| `nack(requeue?)` | Negative acknowledge -- request redelivery |

Both `ack()` and `nack()` are idempotent -- calling either multiple times after the first call has no effect.

## Adapter Comparison

| Feature | Memory | NATS JetStream | Kafka | Redis Streams | AMQP / RabbitMQ |
|---------|--------|---------------|-------|---------------|-----------------|
| **Package** | `@connectum/events` | `@connectum/events-nats` | `@connectum/events-kafka` | `@connectum/events-redis` | `@connectum/events-amqp` |
| **Use case** | Testing | Low-latency, cloud-native | High-throughput, event sourcing | Simple streaming, caching stack | Complex routing, enterprise integration |
| **Persistence** | No | Yes (JetStream) | Yes (log-based) | Yes (AOF/RDB) | Yes (durable queues) |
| **Consumer groups** | No | Yes (durable consumers) | Yes (native) | Yes (XREADGROUP) | Yes (competing consumers) |
| **Ordering** | Per-publish | Per-subject | Per-partition | Per-stream | Per-queue |
| **Wildcard topics** | Yes (`*`, `>`) | Yes (NATS native) | No | No | Yes (`*`, `#`) |
| **Delivery guarantee** | At-most-once | At-least-once | At-least-once | At-least-once | At-least-once |
| **Compatible with** | -- | NATS 2.x+ | Apache Kafka, Redpanda | Redis 5+, Valkey | RabbitMQ 3.x+, LavinMQ |

## When to Use Events

| Pattern | Use Case | Transport |
|---------|----------|-----------|
| **Request-response** | Synchronous queries, CRUD operations | gRPC / ConnectRPC |
| **Pub/sub events** | Decoupled notifications, saga orchestration | EventBus |
| **Streaming** | Real-time data feeds, change data capture | gRPC server streaming |

Use EventBus when services need to react to events **asynchronously** without direct coupling. For synchronous communication, use [Service Communication](/en/guide/service-communication) with gRPC clients.

## Learn More

- [Getting Started](/en/guide/events/getting-started) -- step-by-step setup tutorial
- [Custom Topics](/en/guide/events/custom-topics) -- proto options for topic naming
- [Middleware](/en/guide/events/middleware) -- retry, DLQ, custom middleware
- [Adapters](/en/guide/events/adapters) -- detailed adapter comparison and configuration
- [@connectum/events](/en/packages/events) -- Package Guide
- [@connectum/events API](/en/api/@connectum/events/) -- Full API Reference

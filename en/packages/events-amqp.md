---
title: '@connectum/events-amqp'
description: AMQP / RabbitMQ adapter for @connectum/events EventBus
---

# @connectum/events-amqp

AMQP 0-9-1 adapter for the Connectum EventBus. Provides persistent at-least-once delivery through [RabbitMQ](https://www.rabbitmq.com/) (or compatible brokers like [LavinMQ](https://lavinmq.com/)) using topic exchanges, competing consumers, dead letter exchanges, and metadata propagation via AMQP message headers.

**Layer**: 2 (Broker Adapters)

::: tip Related Guides
- [Events Overview](/en/guide/events) -- event-driven architecture with Connectum
- [Adapters Comparison](/en/guide/events/adapters) -- choosing between NATS, Kafka, Redis, AMQP, and in-memory adapters
- [@connectum/events](/en/packages/events) -- core EventBus API and routing
:::

::: tip Full API Reference
Complete TypeScript API documentation: [API Reference](/en/api/@connectum/events-amqp/)
:::

## Installation

```bash
pnpm add @connectum/events-amqp
```

**Peer dependency**: `@connectum/events`

**Transitive dependency**: [amqplib](https://www.npmjs.com/package/amqplib) (installed automatically)

## Quick Start

```typescript
import { createEventBus } from '@connectum/events';
import { AmqpAdapter } from '@connectum/events-amqp';

const adapter = AmqpAdapter({
  url: 'amqp://guest:guest@localhost:5672',
});

const bus = createEventBus({
  adapter,
  routes: [myRoutes],
  group: 'my-service',
});

await bus.start();

// Publish a typed event
await bus.publish(UserCreatedSchema, { userId: '123', email: 'user@example.com' });

// Graceful shutdown
await bus.stop();
```

## API Reference

### `AmqpAdapter(options)`

Factory function that creates an `EventAdapter` for AMQP 0-9-1 brokers (RabbitMQ, LavinMQ).

```typescript
function AmqpAdapter(options: AmqpAdapterOptions): EventAdapter;
```

Pass the result to `createEventBus({ adapter })`.

### `AmqpAdapterOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `url` | `string` | *(required)* | AMQP connection URL (e.g., `"amqp://guest:guest@localhost:5672"`) |
| `socketOptions` | `Record<string, unknown>` | `undefined` | Low-level socket options passed to `amqplib.connect()` (TLS certificates, timeouts) |
| `exchange` | `string` | `"connectum.events"` | Exchange name. Created automatically on `connect()` if it does not exist |
| `exchangeType` | `"topic" \| "direct" \| "fanout" \| "headers"` | `"topic"` | Exchange type. `"topic"` enables wildcard routing keys |
| `exchangeOptions` | `AmqpExchangeOptions` | `undefined` | Exchange declaration options |
| `queueOptions` | `AmqpQueueOptions` | `undefined` | Queue declaration options |
| `consumerOptions` | `AmqpConsumerOptions` | `undefined` | Consumer tuning options |
| `publisherOptions` | `AmqpPublisherOptions` | `undefined` | Publisher tuning options |

### `AmqpExchangeOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `durable` | `boolean` | `true` | Survive broker restarts |
| `autoDelete` | `boolean` | `false` | Delete exchange when all queues unbind |

### `AmqpQueueOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `durable` | `boolean` | `true` | Survive broker restarts (persists queue metadata) |
| `messageTtl` | `number` | `undefined` | Per-queue message time-to-live in milliseconds |
| `maxLength` | `number` | `undefined` | Maximum number of messages in the queue |
| `deadLetterExchange` | `string` | `undefined` | Exchange to route rejected/expired messages to |
| `deadLetterRoutingKey` | `string` | `undefined` | Routing key used when publishing to the dead letter exchange |

### `AmqpConsumerOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `prefetch` | `number` | `10` | Channel-level prefetch count (`QoS`). Controls how many unacknowledged messages a consumer receives at once |
| `exclusive` | `boolean` | `false` | Exclusive consumer -- only this connection can consume from the queue |

### `AmqpPublisherOptions`

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `persistent` | `boolean` | `true` | Mark messages as persistent (`deliveryMode: 2`). Messages survive broker restarts when the queue is durable |
| `mandatory` | `boolean` | `false` | Return unroutable messages to the publisher via the `return` event |

## Configuration Examples

### Minimal

```typescript
const adapter = AmqpAdapter({
  url: 'amqp://localhost:5672',
});
```

### Full Configuration

```typescript
const adapter = AmqpAdapter({
  url: 'amqp://user:password@rabbitmq.example.com:5672/my-vhost',
  exchange: 'orders.events',
  exchangeType: 'topic',
  exchangeOptions: {
    durable: true,
    autoDelete: false,
  },
  queueOptions: {
    durable: true,
    messageTtl: 86_400_000,        // 24 hours
    maxLength: 1_000_000,
    deadLetterExchange: 'orders.dlx',
    deadLetterRoutingKey: 'orders.dead',
  },
  consumerOptions: {
    prefetch: 50,
    exclusive: false,
  },
  publisherOptions: {
    persistent: true,
    mandatory: false,
  },
});
```

### TLS Connection

```typescript
import { readFileSync } from 'node:fs';

const adapter = AmqpAdapter({
  url: 'amqps://user:password@rabbitmq.example.com:5671',
  socketOptions: {
    cert: readFileSync('/path/to/client-cert.pem'),
    key: readFileSync('/path/to/client-key.pem'),
    ca: [readFileSync('/path/to/ca-cert.pem')],
    rejectUnauthorized: true,
  },
});
```

### Virtual Host (vhost)

AMQP virtual hosts provide logical isolation within a single broker. Specify the vhost in the URL path:

```typescript
// Default vhost "/"
const adapter = AmqpAdapter({ url: 'amqp://localhost:5672' });

// Named vhost
const adapter = AmqpAdapter({ url: 'amqp://user:pass@localhost:5672/production' });

// URL-encoded vhost (if name contains special characters)
const adapter = AmqpAdapter({ url: 'amqp://user:pass@localhost:5672/%2Fmy-vhost' });
```

### LavinMQ

[LavinMQ](https://lavinmq.com/) is a lightweight, high-performance AMQP 0-9-1 broker compatible with RabbitMQ. The `AmqpAdapter` works with LavinMQ without modification:

```typescript
const adapter = AmqpAdapter({
  url: 'amqp://guest:guest@lavinmq-host:5672',
});
```

## Adapter Lifecycle

The `AmqpAdapter` follows the `EventAdapter` interface lifecycle managed by `createEventBus()`:

```
connect() → publish() / subscribe() → disconnect()
```

| Method | Description |
|--------|-------------|
| `connect(context?)` | Opens an AMQP connection, creates a channel, asserts the exchange. Uses `context.serviceName` as `clientProperties.connection_name` if not set explicitly. |
| `disconnect()` | Cancels all active consumers, closes the channel and connection |
| `publish()` | Publishes a serialized event to the exchange with `eventType` as the routing key. Metadata is propagated as AMQP message headers |
| `subscribe()` | Declares queues (named or auto-delete), binds them to the exchange with topic patterns, and starts consuming with explicit ack/nack |

::: info Automatic Exchange Creation
On `connect()`, the adapter asserts the configured exchange (default: `"connectum.events"` with type `"topic"`). If the exchange does not exist, it is created. For production, you may want to pre-create exchanges with specific policies via RabbitMQ management.
:::

## AMQP Concepts

Understanding a few AMQP concepts helps configure the adapter effectively:

### Exchanges

An **exchange** receives published messages and routes them to bound queues based on the routing key and exchange type. The adapter uses a `topic` exchange by default, which supports wildcard routing patterns.

### Queues

A **queue** stores messages until they are consumed. The adapter creates queues automatically:
- **With `group`**: named queue `{exchange}.{group}` -- durable, shared across instances (competing consumers)
- **Without `group`**: anonymous auto-delete queue -- exclusive to this consumer, deleted on disconnect

### Routing Keys

Events are published with `eventType` as the routing key. For example, publishing a `user.created` event results in the AMQP routing key `user.created`.

### Wildcard Binding

When using a `topic` exchange, AMQP supports two wildcard tokens in binding patterns:

| EventBus Pattern | AMQP Binding Key | Description |
|------------------|------------------|-------------|
| `user.created` | `user.created` | Exact match |
| `user.*` | `user.*` | Matches exactly one word (`user.created`, `user.deleted`) |
| `user.>` | `user.#` | Matches zero or more words (`user`, `user.created`, `user.profile.updated`) |

The adapter translates `>` (EventBus multi-segment wildcard) to `#` (AMQP multi-word wildcard) automatically.

### Consumer Groups (Competing Consumers)

When a `group` name is set on the EventBus, all instances sharing the same group bind to the same named queue. RabbitMQ distributes messages round-robin across consumers on that queue, ensuring each message is processed by exactly one instance.

```typescript
// Two instances share load for order events
const bus = createEventBus({
  adapter: AmqpAdapter({ url: 'amqp://localhost:5672' }),
  routes: [orderRoutes],
  group: 'order-service', // Same group = competing consumers
});
```

### Dead Letter Exchange (DLX)

AMQP natively supports dead letter exchanges. When a message is rejected (`nack` without requeue) or expires, RabbitMQ routes it to the configured dead letter exchange:

```typescript
const adapter = AmqpAdapter({
  url: 'amqp://localhost:5672',
  queueOptions: {
    deadLetterExchange: 'my-service.dlx',
    deadLetterRoutingKey: 'my-service.dead',
  },
});
```

This works alongside the EventBus-level DLQ middleware. For broker-native DLQ handling, configure `queueOptions.deadLetterExchange`. For application-level DLQ, use the `middleware.dlq` option in `createEventBus()`.

### At-Least-Once Delivery

The adapter uses **manual acknowledgment** (AMQP `noAck: false`). Each message must be acknowledged by the handler. If the handler throws an error, the message is negatively acknowledged (`nack`) and requeued for redelivery (subject to `maxDeliver` / retry limits).

### Delivery Attempts

AMQP does not natively track delivery attempt counts. The adapter infers the attempt number from the `redelivered` flag on the message:
- `redelivered: false` → `attempt: 1` (first delivery)
- `redelivered: true` → `attempt: 2` (redelivery)

For fine-grained retry control, use the EventBus retry middleware which tracks attempts independently.

## Metadata Propagation

Event metadata is transmitted as AMQP message headers, enabling cross-service context propagation:

```typescript
// Publishing with metadata
await bus.publish(OrderCreatedSchema, orderData, {
  metadata: {
    'x-correlation-id': correlationId,
    'x-tenant-id': tenantId,
  },
});
```

On the consumer side, metadata is available through `EventContext`:

```typescript
const routes = (events: EventRouter) => {
  events.service(OrderEventHandlers, {
    async onOrderCreated(event, ctx) {
      const correlationId = ctx.metadata.get('x-correlation-id');
      // ...
    },
  });
};
```

## Exports Summary

| Export | Description |
|--------|-------------|
| `AmqpAdapter` | Factory function that creates an AMQP adapter |
| `toAmqpPattern` | Converts EventBus wildcard pattern (`>`) to AMQP routing key pattern (`#`) |
| `AmqpAdapterOptions` | Configuration options type |
| `AmqpExchangeOptions` | Exchange declaration options type |
| `AmqpQueueOptions` | Queue declaration options type |
| `AmqpConsumerOptions` | Consumer tuning options type |
| `AmqpPublisherOptions` | Publisher tuning options type |

## Related Packages

- **[@connectum/events](./events.md)** -- Core EventBus API, routing, and middleware (peer dependency)
- **[@connectum/events-nats](./events-nats.md)** -- NATS JetStream adapter alternative
- **[@connectum/events-kafka](./events-kafka.md)** -- Kafka / Redpanda adapter alternative
- **[@connectum/events-redis](./events-redis.md)** -- Redis Streams adapter alternative
- **[@connectum/core](./core.md)** -- Server framework for hosting services alongside the event bus

## Learn More

- [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html) -- official RabbitMQ reference
- [amqplib Documentation](https://amqp-node.github.io/amqplib/) -- underlying Node.js client library
- [LavinMQ](https://lavinmq.com/) -- lightweight AMQP 0-9-1 compatible broker
- [ADR-026](/en/contributing/adr/026-eventbus-architecture) -- architectural decision for the EventBus design

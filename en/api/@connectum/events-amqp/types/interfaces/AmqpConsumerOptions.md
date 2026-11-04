[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpConsumerOptions

# Interface: AmqpConsumerOptions

Defined in: [packages/events-amqp/src/types.ts:904](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L904)

Consumer options.

## Properties

### exclusive?

> `readonly` `optional` **exclusive?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:950](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L950)

Whether the private queue of a subscription without `group` is exclusive
to the subscriber's connection, so the broker removes it with that
connection. RabbitMQ 4.3 and later refuse a queue that is neither
durable nor exclusive, so `false` works only on older brokers or where the
`transient_nonexcl_queues` deprecated feature is permitted. Subscriptions
with `group` use a durable shared queue by default and ignore this option.

#### Default

```ts
true
```

***

### prefetch?

> `readonly` `optional` **prefetch?**: `number`

Defined in: [packages/events-amqp/src/types.ts:912](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L912)

Prefetch count (QoS) — how many unacknowledged messages
a consumer can have at a time. An integer from 0 (no limit) to 65535;
any other value makes `AmqpAdapter()` throw a `RangeError`.

#### Default

```ts
10
```

***

### redeliveryDelay?

> `readonly` `optional` **redeliveryDelay?**: `number`

Defined in: [packages/events-amqp/src/types.ts:938](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L938)

Milliseconds to hold a message unacknowledged after its handler threw,
before it is requeued. Opt-in: unset or `0` requeues at once, so a
handler that always throws receives the same message as fast as the
broker can deliver it (tens of thousands of times in a few seconds,
measured against RabbitMQ 4.3), which keeps a CPU core busy and floods
the logs.

The held message occupies one `prefetch` slot for the whole delay, and
the delay applies to every handler failure of this adapter's
subscriptions, not only to a poison message. It does not apply to a
message the handler already settled with `ack()` or `nack()`.
`unsubscribe()` ends the wait and requeues a held message at once. When the
channel closes during the wait (`disconnect()`, a lost connection) the wait
ends and the broker returns the message itself.
The attempt number stays 1 or 2: `redelivered` is a flag, not a counter,
so a delay does not replace `retry` and `dlq` middleware for a message
that can never succeed.

A finite number of milliseconds from `0` to `2147483647` (the largest
delay a timer honors); anything else makes `AmqpAdapter()` throw.

#### Default

```ts
0
```

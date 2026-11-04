[Connectum API Reference](../../../../index.md) / [@connectum/events-nats](../../index.md) / [types](../index.md) / NatsConsumerOptions

# Interface: NatsConsumerOptions

Defined in: [types.ts:51](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-nats/src/types.ts#L51)

Options for JetStream consumer behaviour.

## Properties

### ackWait?

> `readonly` `optional` **ackWait?**: `number`

Defined in: [types.ts:74](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-nats/src/types.ts#L74)

Ack wait timeout in milliseconds.
After this period an unacknowledged message is redelivered.

A finite number greater than 0 (a fraction is sent as whole nanoseconds); `0`, a negative
number or `NaN` makes `NatsAdapter()` throw (`0` used to become the default, a negative
number made the server redeliver at once).

#### Default

```ts
30_000
```

***

### deliverPolicy?

> `readonly` `optional` **deliverPolicy?**: `"all"` \| `"last"` \| `"new"`

Defined in: [types.ts:62](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-nats/src/types.ts#L62)

Deliver policy for new consumers.
- `"new"` — only messages published after consumer creation
- `"all"` — all available messages
- `"last"` — last message per subject

Any other value makes `NatsAdapter()` throw (it used to behave like `"new"`).

#### Default

```ts
"new"
```

***

### maxDeliver?

> `readonly` `optional` **maxDeliver?**: `number`

Defined in: [types.ts:87](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-nats/src/types.ts#L87)

Maximum number of delivery attempts. When the limit is reached,
JetStream stops redelivering the message and emits a max-deliver
advisory; the message remains in the stream subject to its retention
policy.

`-1` means unlimited; otherwise a positive integer. `0`, other negative numbers and fractions
make `NatsAdapter()` throw.

#### Default

```ts
5
```

***

### prefetch?

> `readonly` `optional` **prefetch?**: `number`

Defined in: [types.ts:105](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-nats/src/types.ts#L105)

How many messages the server may hand to one consumer ahead of its handler (the size of the
client's pull buffer).

The server starts the `ackWait` timer of a message when it delivers the message to the client's
buffer, not when the handler starts, and the handler of a consumer runs one message at a time.
With the client's default buffer of 100, a message at the back of a full buffer is redelivered
when the handling time of the messages in front of it outgrows `ackWait`, and a single
consumer then receives duplicates (`ackWait` of 30 s divided by 100 is 300 ms of handling per
message, as arithmetic and not as a measurement). A smaller
buffer keeps the wait in the buffer short, and the client asks the server for messages more
often; `1` keeps at most one message ahead of the handler.

An integer from 1 to 2147483647. Unset keeps the client's own default (100), so existing
deployments are unchanged.

***

### redeliveryDelay?

> `readonly` `optional` **redeliveryDelay?**: `number`

Defined in: [types.ts:125](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-nats/src/types.ts#L125)

Pause in milliseconds between a handler failure and the redelivery of the message. Opt-in:
unset or `0` gives the message back at once, so a handler that always throws receives it again
within milliseconds and the whole `maxDeliver` budget is gone before a transient failure
(a database that restarts, a dependency that is briefly down) can recover.

The pause is held by the server (`nak` with a delay), so it does not occupy a `prefetch` slot
or block the handler, and it applies to every handler failure of this adapter's
subscriptions, not only to a poison message. It does not apply to an explicit `nack()` of the
handler, and `unsubscribe()` or `disconnect()` cannot shorten a pause already granted: the
message reaches the next consumer of the group after it. The server keeps counting each
delivery against `maxDeliver`, so a delay does not replace the `retry` and `dlq` middleware for
a message that can never succeed.

An integer number of milliseconds from `0` to `2147483647`; anything else makes `NatsAdapter()` throw.

#### Default

```ts
0
```

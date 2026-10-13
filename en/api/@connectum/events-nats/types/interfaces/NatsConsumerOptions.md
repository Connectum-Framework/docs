[Connectum API Reference](../../../../index.md) / [@connectum/events-nats](../../index.md) / [types](../index.md) / NatsConsumerOptions

# Interface: NatsConsumerOptions

Defined in: [types.ts:46](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-nats/src/types.ts#L46)

Options for JetStream consumer behaviour.

## Properties

### ackWait?

> `readonly` `optional` **ackWait?**: `number`

Defined in: [types.ts:63](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-nats/src/types.ts#L63)

Ack wait timeout in milliseconds.
After this period an unacknowledged message is redelivered.

#### Default

```ts
30_000
```

***

### deliverPolicy?

> `readonly` `optional` **deliverPolicy?**: `"all"` \| `"last"` \| `"new"`

Defined in: [types.ts:55](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-nats/src/types.ts#L55)

Deliver policy for new consumers.
- `"new"` — only messages published after consumer creation
- `"all"` — all available messages
- `"last"` — last message per subject

#### Default

```ts
"new"
```

***

### maxDeliver?

> `readonly` `optional` **maxDeliver?**: `number`

Defined in: [types.ts:73](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-nats/src/types.ts#L73)

Maximum number of delivery attempts. When the limit is reached,
JetStream stops redelivering the message and emits a max-deliver
advisory; the message remains in the stream subject to its retention
policy.

#### Default

```ts
5
```

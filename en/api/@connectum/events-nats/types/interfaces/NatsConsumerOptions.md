[Connectum API Reference](../../../../index.md) / [@connectum/events-nats](../../index.md) / [types](../index.md) / NatsConsumerOptions

# Interface: NatsConsumerOptions

Defined in: [types.ts:41](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events-nats/src/types.ts#L41)

Options for JetStream consumer behaviour.

## Properties

### ackWait?

> `readonly` `optional` **ackWait?**: `number`

Defined in: [types.ts:58](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events-nats/src/types.ts#L58)

Ack wait timeout in milliseconds.
After this period an unacknowledged message is redelivered.

#### Default

```ts
30_000
```

***

### deliverPolicy?

> `readonly` `optional` **deliverPolicy?**: `"new"` \| `"all"` \| `"last"`

Defined in: [types.ts:50](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events-nats/src/types.ts#L50)

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

Defined in: [types.ts:66](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/events-nats/src/types.ts#L66)

Maximum number of delivery attempts before the message
is discarded by the server.

#### Default

```ts
5
```

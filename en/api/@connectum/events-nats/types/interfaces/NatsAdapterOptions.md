[Connectum API Reference](../../../../index.md) / [@connectum/events-nats](../../index.md) / [types](../index.md) / NatsAdapterOptions

# Interface: NatsAdapterOptions

Defined in: [types.ts:12](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-nats/src/types.ts#L12)

Options for creating a NATS JetStream adapter.

## Properties

### connectionOptions?

> `readonly` `optional` **connectionOptions?**: `Partial`\<`NodeConnectionOptions`\>

Defined in: [types.ts:37](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-nats/src/types.ts#L37)

NATS connection options (escape hatch for advanced config).

The `servers` field from this object is overridden by the
top-level `servers` option.

***

### consumerOptions?

> `readonly` `optional` **consumerOptions?**: [`NatsConsumerOptions`](NatsConsumerOptions.md)

Defined in: [types.ts:45](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-nats/src/types.ts#L45)

JetStream consumer tuning options.

***

### lifecycle?

> `readonly` `optional` **lifecycle?**: [`NatsLifecycleCallbacks`](NatsLifecycleCallbacks.md)

Defined in: [types.ts:42](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-nats/src/types.ts#L42)

Connection lifecycle callback. Without it the adapter attaches no listener to the client and behaves as before.

***

### servers

> `readonly` **servers**: `string` \| `string`[]

Defined in: [types.ts:19](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-nats/src/types.ts#L19)

NATS server URL(s). Accepts a single string or an array.

A non-empty string, or a non-empty array of non-empty strings; anything else makes `NatsAdapter()` throw
(an empty value used to make the client dial its local default address).

***

### stream?

> `readonly` `optional` **stream?**: `string`

Defined in: [types.ts:29](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-nats/src/types.ts#L29)

JetStream stream name.

When set, subjects are prefixed with `{stream}.` and the stream
is auto-created on `connect()` if it does not exist.

#### Default

```ts
"events"
```

[Connectum API Reference](../../../../index.md) / [@connectum/events-nats](../../index.md) / [types](../index.md) / NatsAdapterOptions

# Interface: NatsAdapterOptions

Defined in: [types.ts:12](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-nats/src/types.ts#L12)

Options for creating a NATS JetStream adapter.

## Properties

### connectionOptions?

> `readonly` `optional` **connectionOptions?**: `Partial`\<`NodeConnectionOptions`\>

Defined in: [types.ts:32](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-nats/src/types.ts#L32)

NATS connection options (escape hatch for advanced config).

The `servers` field from this object is overridden by the
top-level `servers` option.

***

### consumerOptions?

> `readonly` `optional` **consumerOptions?**: [`NatsConsumerOptions`](NatsConsumerOptions.md)

Defined in: [types.ts:35](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-nats/src/types.ts#L35)

JetStream consumer tuning options.

***

### servers

> `readonly` **servers**: `string` \| `string`[]

Defined in: [types.ts:14](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-nats/src/types.ts#L14)

NATS server URL(s). Accepts a single string or an array.

***

### stream?

> `readonly` `optional` **stream?**: `string`

Defined in: [types.ts:24](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events-nats/src/types.ts#L24)

JetStream stream name.

When set, subjects are prefixed with `{stream}.` and the stream
is auto-created on `connect()` if it does not exist.

#### Default

```ts
"events"
```

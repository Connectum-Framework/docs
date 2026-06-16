[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpPublisherOptions

# Interface: AmqpPublisherOptions

Defined in: [packages/events-amqp/src/types.ts:304](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events-amqp/src/types.ts#L304)

Publisher options.

## Properties

### correlationHeader?

> `readonly` `optional` **correlationHeader?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:333](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events-amqp/src/types.ts#L333)

How `basic.return` frames are correlated to publishes when
`mandatory: true`. The return frame carries no deliveryTag, so:

- `true` (default): stamp a private `x-connectum-publish-id` header on
  mandatory publishes and match returns by it. The header is visible
  on the wire to external consumers — document it in contracts.
- `false`: no header; mandatory publishes are serialized
  (single-flight) so at most one is outstanding at a time —
  correlation is unambiguous at the cost of throughput.

#### Default

```ts
true
```

***

### mandatory?

> `readonly` `optional` **mandatory?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:318](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events-amqp/src/types.ts#L318)

Whether the message should be returned if it cannot be routed.
Unroutable messages reject the publish with `AmqpUnroutableError`.

#### Default

```ts
false
```

***

### persistent?

> `readonly` `optional` **persistent?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:310](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events-amqp/src/types.ts#L310)

Whether messages should be persisted to disk (deliveryMode=2).

#### Default

```ts
true
```

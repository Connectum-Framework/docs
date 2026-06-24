[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpPublisherOptions

# Interface: AmqpPublisherOptions

Defined in: [packages/events-amqp/src/types.ts:304](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L304)

Publisher options.

## Properties

### correlationHeader?

> `readonly` `optional` **correlationHeader?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:333](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L333)

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

### externalContract?

> `readonly` `optional` **externalContract?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:362](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L362)

Publish against an EXTERNAL (non-EventBus) message contract: suppress the
EventBus envelope so the wire frame carries ONLY contract-specified
properties. For an external AsyncAPI/AMQP contract the oracle is the
published spec, not this serializer — a third-party consumer validates the
exact header/property set, which must not include adapter-internal fields.

When `true`, `publish()`:
- does NOT stamp the `x-event-id` / `x-published-at` headers;
- does NOT auto-populate the `messageId` or `timestamp` properties;
- uses single-flight correlation for `mandatory` publishes (so no
  `x-connectum-publish-id` header reaches the wire) — `correlationHeader`
  is ignored in this mode.

The frame then carries only `contentType`, `persistent`/deliveryMode,
`mandatory`, and exactly the headers passed via `PublishOptions.metadata`.
Per-message confirms, `mandatory` → `AmqpUnroutableError`, the typed error
taxonomy, and connection recovery are unchanged.

Leave unset (default) for normal EventBus use, where the envelope is
stamped on publish and stripped on delivery. When the contract requires a
specific `messageId` / `timestamp`, set them per-publish via
`PublishOptions.messageId` / `PublishOptions.timestamp` (a caller-supplied
value is used as-is; in external-contract mode nothing is auto-generated).

#### Default

```ts
false
```

***

### mandatory?

> `readonly` `optional` **mandatory?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:318](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L318)

Whether the message should be returned if it cannot be routed.
Unroutable messages reject the publish with `AmqpUnroutableError`.

#### Default

```ts
false
```

***

### persistent?

> `readonly` `optional` **persistent?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:310](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L310)

Whether messages should be persisted to disk (deliveryMode=2).

#### Default

```ts
true
```

[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [testing](../index.md) / FakeAmqpAdapterOptions

# Interface: FakeAmqpAdapterOptions

Defined in: [packages/events-amqp/src/testing.ts:73](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L73)

Options for [FakeAmqpAdapter](../functions/FakeAmqpAdapter.md).

## Properties

### exchangeType?

> `readonly` `optional` **exchangeType?**: `"headers"` \| `"topic"` \| `"direct"` \| `"fanout"`

Defined in: [packages/events-amqp/src/testing.ts:89](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L89)

Mirror of the real option. `subscribe()` applies the real adapter's
pattern validation for this exchange type and [topologyMode](#topologymode), and
`deliver()` routes like the broker would: `topic` and `direct` by the
shared EventBus matcher (a direct subscription is a literal key unless
the operator owns the bindings), `fanout` and `headers` to every live
subscription regardless of its pattern, as the queue receives every
message there and the EventBus alone picks handlers. The fake does not
model `topology`, so declared header bindings are not modeled either: a
headers fake delivers every message even where the real adapter, with
selective `x-match` bindings declared for the queue, would deliver only
the matching ones.

#### Default

```ts
"topic"
```

***

### failFastOnInitialSetupError?

> `readonly` `optional` **failFastOnInitialSetupError?**: `boolean`

Defined in: [packages/events-amqp/src/testing.ts:106](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L106)

Mirror of the real option: a topology `failSetup(...)` queued before
`connect()` rejects it with the typed error instead of report-and-proceed.

***

### lifecycle?

> `readonly` `optional` **lifecycle?**: [`AmqpLifecycleCallbacks`](../../types/interfaces/AmqpLifecycleCallbacks.md)

Defined in: [packages/events-amqp/src/testing.ts:101](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L101)

The same lifecycle surface as the real adapter (union + flat shim).

***

### recovery?

> `readonly` `optional` **recovery?**: `boolean`

Defined in: [packages/events-amqp/src/testing.ts:116](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L116)

Mirror of the real option, reduced to what a consumer loss reports:
`false` makes [FakeAmqpControl.loseConsumer](FakeAmqpControl.md#loseconsumer) deliver
`consumer-lost { willRestore: false }` and makes
[FakeAmqpControl.restoreConsumers](FakeAmqpControl.md#restoreconsumers) throw, because the real adapter
would not restore anything. Backoff knobs are not modeled.

#### Default

```ts
true
```

***

### topologyMode?

> `readonly` `optional` **topologyMode?**: [`AmqpTopologyMode`](../../types/type-aliases/AmqpTopologyMode.md)

Defined in: [packages/events-amqp/src/testing.ts:99](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L99)

Mirror of the real option, used for pattern validation only: a wildcard
subscription on a direct exchange is rejected in `"assert"` (the adapter
would bind a literal key that never matches) and accepted in `"check"`
and `"skip"` (the operator's bindings decide). The fake models no
topology, so nothing else changes with this option.

#### Default

```ts
"assert"
```

[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [testing](../index.md) / FakeAmqpAdapterOptions

# Interface: FakeAmqpAdapterOptions

Defined in: [packages/events-amqp/src/testing.ts:65](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L65)

Options for [FakeAmqpAdapter](../functions/FakeAmqpAdapter.md).

## Properties

### failFastOnInitialSetupError?

> `readonly` `optional` **failFastOnInitialSetupError?**: `boolean`

Defined in: [packages/events-amqp/src/testing.ts:72](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L72)

Mirror of the real option: a topology `failSetup(...)` queued before
`connect()` rejects it with the typed error instead of report-and-proceed.

***

### lifecycle?

> `readonly` `optional` **lifecycle?**: [`AmqpLifecycleCallbacks`](../../types/interfaces/AmqpLifecycleCallbacks.md)

Defined in: [packages/events-amqp/src/testing.ts:67](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L67)

The same lifecycle surface as the real adapter (union + flat shim).

***

### recovery?

> `readonly` `optional` **recovery?**: `boolean`

Defined in: [packages/events-amqp/src/testing.ts:82](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L82)

Mirror of the real option, reduced to what a consumer loss reports:
`false` makes [FakeAmqpControl.loseConsumer](FakeAmqpControl.md#loseconsumer) deliver
`consumer-lost { willRestore: false }` and makes
[FakeAmqpControl.restoreConsumers](FakeAmqpControl.md#restoreconsumers) throw, because the real adapter
would not restore anything. Backoff knobs are not modeled.

#### Default

```ts
true
```

[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [testing](../index.md) / FakeAmqpAdapterOptions

# Interface: FakeAmqpAdapterOptions

Defined in: [packages/events-amqp/src/testing.ts:54](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L54)

Options for [FakeAmqpAdapter](../functions/FakeAmqpAdapter.md).

## Properties

### failFastOnInitialSetupError?

> `readonly` `optional` **failFastOnInitialSetupError?**: `boolean`

Defined in: [packages/events-amqp/src/testing.ts:61](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L61)

Mirror of the real option: a topology `failSetup(...)` queued before
`connect()` rejects it with the typed error instead of report-and-proceed.

***

### lifecycle?

> `readonly` `optional` **lifecycle?**: [`AmqpLifecycleCallbacks`](../../types/interfaces/AmqpLifecycleCallbacks.md)

Defined in: [packages/events-amqp/src/testing.ts:56](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L56)

The same lifecycle surface as the real adapter (union + flat shim).

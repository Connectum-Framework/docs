[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [testing](../index.md) / FakeAmqpAdapterOptions

# Interface: FakeAmqpAdapterOptions

Defined in: [packages/events-amqp/src/testing.ts:53](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L53)

Options for [FakeAmqpAdapter](../functions/FakeAmqpAdapter.md).

## Properties

### failFastOnInitialSetupError?

> `readonly` `optional` **failFastOnInitialSetupError?**: `boolean`

Defined in: [packages/events-amqp/src/testing.ts:60](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L60)

Mirror of the real option: a topology `failSetup(...)` queued before
`connect()` rejects it with the typed error instead of report-and-proceed.

***

### lifecycle?

> `readonly` `optional` **lifecycle?**: [`AmqpLifecycleCallbacks`](../../types/interfaces/AmqpLifecycleCallbacks.md)

Defined in: [packages/events-amqp/src/testing.ts:55](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/testing.ts#L55)

The same lifecycle surface as the real adapter (union + flat shim).

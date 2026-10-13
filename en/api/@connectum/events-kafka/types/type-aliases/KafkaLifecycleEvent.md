[Connectum API Reference](../../../../index.md) / [@connectum/events-kafka](../../index.md) / [types](../index.md) / KafkaLifecycleEvent

# Type Alias: KafkaLifecycleEvent

> **KafkaLifecycleEvent** = \{ `reconnected`: `false`; `type`: `"connected"`; \} \| \{ `error`: `Error`; `groupId`: `string`; `type`: `"consumer-lost"`; `willRestore`: `boolean`; \} \| \{ `attempt`: `number`; `groupId`: `string`; `type`: `"consumer-restored"`; \} \| \{ `attempt`: `number`; `error`: `Error`; `groupId`: `string`; `type`: `"consumer-restore-failed"`; `willRetry`: `boolean`; \} \| \{ `callback`: `string`; `error`: `Error`; `event`: `string`; `type`: `"lifecycle-error"`; \}

Defined in: [types.ts:218](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L218)

Lifecycle events of the Kafka adapter, delivered to [KafkaLifecycleCallbacks.onLifecycle](../interfaces/KafkaLifecycleCallbacks.md#onlifecycle).

A discriminated union on `type`. The strings and the shared fields match the AMQP adapter's events;
the type is local to this package.

The client library reports no loss of the producer's connection, and a consumer rides out a short
broker outage without any event, so the adapter does not report `disconnected`, `reconnecting` or
`reconnect-failed`. What the client does report, and what this union carries, is a consumer that
crashed (it has given up retrying), and its return to the group.

## Union Members

### Type Literal

\{ `reconnected`: `false`; `type`: `"connected"`; \}

#### reconnected

> `readonly` **reconnected**: `false`

#### type

> `readonly` **type**: `"connected"`

The producer connected, once, when `connect()` succeeded.

***

### Type Literal

\{ `error`: `Error`; `groupId`: `string`; `type`: `"consumer-lost"`; `willRestore`: `boolean`; \}

#### error

> `readonly` **error**: `Error`

#### groupId

> `readonly` **groupId**: `string`

#### type

> `readonly` **type**: `"consumer-lost"`

A subscription's consumer crashed: the client stopped it after its own retries ran out. Delivered once per loss.

#### willRestore

> `readonly` **willRestore**: `boolean`

`true` when the client will restart the consumer on its own.

***

### Type Literal

\{ `attempt`: `number`; `groupId`: `string`; `type`: `"consumer-restored"`; \}

#### attempt

> `readonly` **attempt**: `number`

#### groupId

> `readonly` **groupId**: `string`

#### type

> `readonly` **type**: `"consumer-restored"`

A lost consumer joined its group again; `attempt` is the 1-based number of the restart that succeeded.

***

### Type Literal

\{ `attempt`: `number`; `error`: `Error`; `groupId`: `string`; `type`: `"consumer-restore-failed"`; `willRetry`: `boolean`; \}

#### attempt

> `readonly` **attempt**: `number`

#### error

> `readonly` **error**: `Error`

#### groupId

> `readonly` **groupId**: `string`

#### type

> `readonly` **type**: `"consumer-restore-failed"`

The consumer crashed again before it came back; `attempt` counts the failed restarts of this loss.

#### willRetry

> `readonly` **willRetry**: `boolean`

***

### Type Literal

\{ `callback`: `string`; `error`: `Error`; `event`: `string`; `type`: `"lifecycle-error"`; \}

#### callback

> `readonly` **callback**: `string`

#### error

> `readonly` **error**: `Error`

#### event

> `readonly` **event**: `string`

#### type

> `readonly` **type**: `"lifecycle-error"`

A lifecycle callback threw or returned a rejected promise.

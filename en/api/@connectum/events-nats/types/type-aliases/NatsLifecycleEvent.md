[Connectum API Reference](../../../../index.md) / [@connectum/events-nats](../../index.md) / [types](../index.md) / NatsLifecycleEvent

# Type Alias: NatsLifecycleEvent

> **NatsLifecycleEvent** = \{ `reconnected`: `boolean`; `server?`: `string`; `type`: `"connected"`; \} \| \{ `server`: `string`; `type`: `"disconnected"`; \} \| \{ `attempt`: `number`; `type`: `"reconnecting"`; \} \| \{ `error`: `Error`; `type`: `"reconnect-failed"`; \} \| \{ `callback`: `string`; `error`: `Error`; `event`: `string`; `type`: `"lifecycle-error"`; \}

Defined in: [types.ts:82](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-nats/src/types.ts#L82)

Connection lifecycle events of the NATS adapter, delivered to [NatsLifecycleCallbacks.onLifecycle](../interfaces/NatsLifecycleCallbacks.md#onlifecycle).

A discriminated union on `type`. The strings and the shared fields match the AMQP adapter's events; the
type is local to this package. Without the callback the adapter attaches no listener to the client.

## Union Members

### Type Literal

\{ `reconnected`: `boolean`; `server?`: `string`; `type`: `"connected"`; \}

#### reconnected

> `readonly` **reconnected**: `boolean`

#### server?

> `readonly` `optional` **server?**: `string`

The server reached again; set only for a recovery.

#### type

> `readonly` **type**: `"connected"`

Delivered once after the first connect (`reconnected: false`) and once per recovery (`reconnected: true`).

***

### Type Literal

\{ `server`: `string`; `type`: `"disconnected"`; \}

#### server

> `readonly` **server**: `string`

#### type

> `readonly` **type**: `"disconnected"`

The connection to the server was lost; the client tries to reconnect on its own. Not delivered for `disconnect()`.

***

### Type Literal

\{ `attempt`: `number`; `type`: `"reconnecting"`; \}

#### attempt

> `readonly` **attempt**: `number`

#### type

> `readonly` **type**: `"reconnecting"`

The client dials a server again. `attempt` counts dials since the loss (the client reports one per
address it tries, not one per round); the client reports no delay or error, so none is given.

***

### Type Literal

\{ `error`: `Error`; `type`: `"reconnect-failed"`; \}

#### error

> `readonly` **error**: `Error`

#### type

> `readonly` **type**: `"reconnect-failed"`

Terminal: the client closed itself without a `disconnect()` call, typically after its reconnect budget ran out. The adapter drops the dead connection, so `connect()` can start a new one.

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

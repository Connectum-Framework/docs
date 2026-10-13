[Connectum API Reference](../../../../index.md) / [@connectum/events-redis](../../index.md) / [types](../index.md) / RedisLifecycleEvent

# Type Alias: RedisLifecycleEvent

> **RedisLifecycleEvent** = \{ `connection`: [`RedisLifecycleConnection`](RedisLifecycleConnection.md); `reconnected`: `boolean`; `type`: `"connected"`; \} \| \{ `connection`: [`RedisLifecycleConnection`](RedisLifecycleConnection.md); `error`: `Error`; `type`: `"disconnected"`; \} \| \{ `attempt`: `number`; `connection`: [`RedisLifecycleConnection`](RedisLifecycleConnection.md); `delay`: `number`; `error`: `Error`; `type`: `"reconnecting"`; \} \| \{ `connection`: [`RedisLifecycleConnection`](RedisLifecycleConnection.md); `error`: `Error`; `type`: `"reconnect-failed"`; \} \| \{ `callback`: `string`; `error`: `Error`; `event`: `string`; `type`: `"lifecycle-error"`; \}

Defined in: [types.ts:85](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-redis/src/types.ts#L85)

Connection lifecycle events of the Redis adapter, delivered to [RedisLifecycleCallbacks.onLifecycle](../interfaces/RedisLifecycleCallbacks.md#onlifecycle).

A discriminated union on `type`. The strings and the shared fields match the AMQP adapter's events;
the type is local to this package. The adapter holds one publishing connection and one blocking
connection per subscription, so one broker loss is reported once per connection (`connection` says which).

## Union Members

### Type Literal

\{ `connection`: [`RedisLifecycleConnection`](RedisLifecycleConnection.md); `reconnected`: `boolean`; `type`: `"connected"`; \}

#### connection

> `readonly` **connection**: [`RedisLifecycleConnection`](RedisLifecycleConnection.md)

#### reconnected

> `readonly` **reconnected**: `boolean`

#### type

> `readonly` **type**: `"connected"`

A connection became ready: for the first time (`reconnected: false`) or after a loss (`reconnected: true`).

***

### Type Literal

\{ `connection`: [`RedisLifecycleConnection`](RedisLifecycleConnection.md); `error`: `Error`; `type`: `"disconnected"`; \}

#### connection

> `readonly` **connection**: [`RedisLifecycleConnection`](RedisLifecycleConnection.md)

#### error

> `readonly` **error**: `Error`

#### type

> `readonly` **type**: `"disconnected"`

A connection that had been ready was lost; the client retries on its own. Once per loss, however many attempts fail. Not delivered for the adapter's own close.

***

### Type Literal

\{ `attempt`: `number`; `connection`: [`RedisLifecycleConnection`](RedisLifecycleConnection.md); `delay`: `number`; `error`: `Error`; `type`: `"reconnecting"`; \}

#### attempt

> `readonly` **attempt**: `number`

#### connection

> `readonly` **connection**: [`RedisLifecycleConnection`](RedisLifecycleConnection.md)

#### delay

> `readonly` **delay**: `number`

#### error

> `readonly` **error**: `Error`

#### type

> `readonly` **type**: `"reconnecting"`

The client scheduled a reconnect attempt after `delay` milliseconds; `attempt` counts them since the loss.

***

### Type Literal

\{ `connection`: [`RedisLifecycleConnection`](RedisLifecycleConnection.md); `error`: `Error`; `type`: `"reconnect-failed"`; \}

#### connection

> `readonly` **connection**: [`RedisLifecycleConnection`](RedisLifecycleConnection.md)

#### error

> `readonly` **error**: `Error`

#### type

> `readonly` **type**: `"reconnect-failed"`

Terminal: the client ended without the adapter closing it (a retry strategy that returned no delay).

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

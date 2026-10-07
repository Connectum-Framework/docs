[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpPublishRetryOptions

# Interface: AmqpPublishRetryOptions

Defined in: [packages/events-amqp/src/types.ts:664](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L664)

Tuning for the opt-in bounded publish retry
([AmqpAdapterOptions.publishRetry](AmqpAdapterOptions.md#publishretry)). Backoff knobs mirror
[AmqpRecoveryOptions](AmqpRecoveryOptions.md) (same names, same formula — a delay never
exceeds `maxDelay`) — but `maxRetries` defaults to a BOUNDED `5` here, not
`Infinity`.

## Properties

### factor?

> `readonly` `optional` **factor?**: `number`

Defined in: [packages/events-amqp/src/types.ts:672](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L672)

Exponential backoff factor.

#### Default

```ts
2
```

***

### initialDelay?

> `readonly` `optional` **initialDelay?**: `number`

Defined in: [packages/events-amqp/src/types.ts:668](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L668)

First retry delay in ms.

#### Default

```ts
100
```

***

### jitter?

> `readonly` `optional` **jitter?**: `number`

Defined in: [packages/events-amqp/src/types.ts:674](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L674)

Symmetric jitter factor (0..1).

#### Default

```ts
0.2
```

***

### maxDelay?

> `readonly` `optional` **maxDelay?**: `number`

Defined in: [packages/events-amqp/src/types.ts:670](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L670)

Upper bound of every retry delay in ms; jitter never pushes a delay above it.

#### Default

```ts
30000
```

***

### maxRetries?

> `readonly` `optional` **maxRetries?**: `number`

Defined in: [packages/events-amqp/src/types.ts:666](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L666)

Retries after the first attempt (N retries = N+1 attempts). A negative value, including `-Infinity`, clamps to `0` (single attempt); `Infinity` is honored — retry until `disconnect()` aborts; `NaN` counts as unset. A fraction is floored.

#### Default

```ts
5
```

***

### onRetry?

> `readonly` `optional` **onRetry?**: (`info`) => `void`

Defined in: [packages/events-amqp/src/types.ts:688](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L688)

Observability hook, invoked once per scheduled retry. MUST NOT throw
(exceptions are isolated). Scoped here deliberately — publish retries
are per-operation events, not connection lifecycle, so they do not join
[AmqpLifecycleEvent](../type-aliases/AmqpLifecycleEvent.md).

#### Parameters

##### info

###### attempt

`number`

###### delay

`number`

###### error

`Error`

###### routingKey

`string`

#### Returns

`void`

***

### retryOnTimeout?

> `readonly` `optional` **retryOnTimeout?**: `boolean`

Defined in: [packages/events-amqp/src/types.ts:681](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L681)

Also retry `AmqpPublishTimeoutError` (no broker outcome within
`publishTimeoutMs`). The message state at a timeout is UNKNOWN, so this
raises the duplicate likelihood — enable only with consumer-side dedup.

#### Default

```ts
false
```

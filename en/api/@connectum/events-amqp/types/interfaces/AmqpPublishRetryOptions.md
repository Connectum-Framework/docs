[Connectum API Reference](../../../../index.md) / [@connectum/events-amqp](../../index.md) / [types](../index.md) / AmqpPublishRetryOptions

# Interface: AmqpPublishRetryOptions

Defined in: [packages/events-amqp/src/types.ts:461](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L461)

Tuning for the opt-in bounded publish retry
([AmqpAdapterOptions.publishRetry](AmqpAdapterOptions.md#publishretry)). Backoff knobs mirror
[AmqpRecoveryOptions](AmqpRecoveryOptions.md) (same names, same cap-before-jitter semantics)
— but `maxRetries` defaults to a BOUNDED `5` here, not `Infinity`.

## Properties

### factor?

> `readonly` `optional` **factor?**: `number`

Defined in: [packages/events-amqp/src/types.ts:469](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L469)

Exponential backoff factor.

#### Default

```ts
2
```

***

### initialDelay?

> `readonly` `optional` **initialDelay?**: `number`

Defined in: [packages/events-amqp/src/types.ts:465](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L465)

First retry delay in ms.

#### Default

```ts
100
```

***

### jitter?

> `readonly` `optional` **jitter?**: `number`

Defined in: [packages/events-amqp/src/types.ts:471](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L471)

Symmetric jitter factor (0..1).

#### Default

```ts
0.2
```

***

### maxDelay?

> `readonly` `optional` **maxDelay?**: `number`

Defined in: [packages/events-amqp/src/types.ts:467](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L467)

Base delay cap in ms; jitter applies on top of the capped base.

#### Default

```ts
30000
```

***

### maxRetries?

> `readonly` `optional` **maxRetries?**: `number`

Defined in: [packages/events-amqp/src/types.ts:463](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L463)

Retries after the first attempt (N retries = N+1 attempts). A negative value clamps to `0` (single attempt); `Infinity` is honored — retry until `disconnect()` aborts.

#### Default

```ts
5
```

***

### onRetry?

> `readonly` `optional` **onRetry?**: (`info`) => `void`

Defined in: [packages/events-amqp/src/types.ts:485](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L485)

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

Defined in: [packages/events-amqp/src/types.ts:478](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-amqp/src/types.ts#L478)

Also retry `AmqpPublishTimeoutError` (no broker outcome within
`publishTimeoutMs`). The message state at a timeout is UNKNOWN, so this
raises the duplicate likelihood — enable only with consumer-side dedup.

#### Default

```ts
false
```

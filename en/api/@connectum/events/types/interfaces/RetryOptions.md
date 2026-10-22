[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / RetryOptions

# Interface: RetryOptions

Defined in: [packages/events/src/types.ts:304](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L304)

Retry middleware options

## Properties

### backoff?

> `optional` **backoff?**: `"fixed"` \| `"exponential"` \| `"linear"`

Defined in: [packages/events/src/types.ts:312](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L312)

Backoff strategy

***

### initialDelay?

> `optional` **initialDelay?**: `number`

Defined in: [packages/events/src/types.ts:314](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L314)

Initial delay in ms (default: 1000)

***

### maxDelay?

> `optional` **maxDelay?**: `number`

Defined in: [packages/events/src/types.ts:316](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L316)

Maximum delay in ms (default: 30000)

***

### maxRetries?

> `optional` **maxRetries?**: `number`

Defined in: [packages/events/src/types.ts:310](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L310)

Maximum number of retries after the first attempt: an integer of at least 0 (default: 3).
`0` runs the handler once. Any other value (negative, fractional, `NaN`, infinite) makes
`retryMiddleware` throw when it is created.

***

### multiplier?

> `optional` **multiplier?**: `number`

Defined in: [packages/events/src/types.ts:318](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L318)

Multiplier for exponential backoff (default: 2)

***

### retryableErrors?

> `optional` **retryableErrors?**: (`error`) => `boolean`

Defined in: [packages/events/src/types.ts:320](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L320)

Filter: only retry for these error types

#### Parameters

##### error

`unknown`

#### Returns

`boolean`

[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / RetryOptions

# Interface: RetryOptions

Defined in: [packages/events/src/types.ts:308](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L308)

Retry middleware options

## Properties

### backoff?

> `optional` **backoff?**: `"fixed"` \| `"exponential"` \| `"linear"`

Defined in: [packages/events/src/types.ts:319](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L319)

Backoff strategy (default: `"exponential"`). Any other name throws a `RangeError` from
`retryMiddleware`, and a non-string a `TypeError`; an unknown name used to behave as `"fixed"`.

***

### initialDelay?

> `optional` **initialDelay?**: `number`

Defined in: [packages/events/src/types.ts:325](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L325)

Initial delay in ms (default: 1000): a finite number from 0 to 2147483647 (the longest delay
a timer keeps). `NaN`, a negative number, `Infinity`, a larger number or a non-number throws
when the middleware is created.

***

### maxDelay?

> `optional` **maxDelay?**: `number`

Defined in: [packages/events/src/types.ts:331](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L331)

Maximum delay in ms (default: 30000): a finite number from 1 to 2147483647. Every pause is
capped at it, so `0` or a negative value (which would remove the pause), `NaN`, `Infinity`
and a non-number throw when the middleware is created.

***

### maxRetries?

> `optional` **maxRetries?**: `number`

Defined in: [packages/events/src/types.ts:314](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L314)

Maximum number of retries after the first attempt: an integer of at least 0 (default: 3).
`0` runs the handler once. Any other value (negative, fractional, `NaN`, infinite) makes
`retryMiddleware` throw when it is created.

***

### multiplier?

> `optional` **multiplier?**: `number`

Defined in: [packages/events/src/types.ts:336](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L336)

Multiplier for exponential backoff (default: 2): a finite number of at least 1. A smaller
number (`0` included), `NaN`, `Infinity` and a non-number throw when the middleware is created.

***

### retryableErrors?

> `optional` **retryableErrors?**: (`error`) => `boolean`

Defined in: [packages/events/src/types.ts:338](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L338)

Filter: only retry for these error types

#### Parameters

##### error

`unknown`

#### Returns

`boolean`

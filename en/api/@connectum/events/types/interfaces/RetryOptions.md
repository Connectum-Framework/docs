[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / RetryOptions

# Interface: RetryOptions

Defined in: [packages/events/src/types.ts:287](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L287)

Retry middleware options

## Properties

### backoff?

> `optional` **backoff?**: `"fixed"` \| `"exponential"` \| `"linear"`

Defined in: [packages/events/src/types.ts:295](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L295)

Backoff strategy

***

### initialDelay?

> `optional` **initialDelay?**: `number`

Defined in: [packages/events/src/types.ts:297](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L297)

Initial delay in ms (default: 1000)

***

### maxDelay?

> `optional` **maxDelay?**: `number`

Defined in: [packages/events/src/types.ts:299](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L299)

Maximum delay in ms (default: 30000)

***

### maxRetries?

> `optional` **maxRetries?**: `number`

Defined in: [packages/events/src/types.ts:293](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L293)

Maximum number of retries after the first attempt: an integer of at least 0 (default: 3).
`0` runs the handler once. Any other value (negative, fractional, `NaN`, infinite) makes
`retryMiddleware` throw when it is created.

***

### multiplier?

> `optional` **multiplier?**: `number`

Defined in: [packages/events/src/types.ts:301](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L301)

Multiplier for exponential backoff (default: 2)

***

### retryableErrors?

> `optional` **retryableErrors?**: (`error`) => `boolean`

Defined in: [packages/events/src/types.ts:303](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L303)

Filter: only retry for these error types

#### Parameters

##### error

`unknown`

#### Returns

`boolean`

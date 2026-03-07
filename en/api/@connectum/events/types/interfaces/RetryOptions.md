[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / RetryOptions

# Interface: RetryOptions

Defined in: [types.ts:202](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L202)

Retry middleware options

## Properties

### backoff?

> `optional` **backoff**: `"exponential"` \| `"linear"` \| `"fixed"`

Defined in: [types.ts:206](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L206)

Backoff strategy

***

### initialDelay?

> `optional` **initialDelay**: `number`

Defined in: [types.ts:208](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L208)

Initial delay in ms (default: 1000)

***

### maxDelay?

> `optional` **maxDelay**: `number`

Defined in: [types.ts:210](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L210)

Maximum delay in ms (default: 30000)

***

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [types.ts:204](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L204)

Maximum retry attempts (default: 3)

***

### multiplier?

> `optional` **multiplier**: `number`

Defined in: [types.ts:212](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L212)

Multiplier for exponential backoff (default: 2)

***

### retryableErrors()?

> `optional` **retryableErrors**: (`error`) => `boolean`

Defined in: [types.ts:214](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L214)

Filter: only retry for these error types

#### Parameters

##### error

`unknown`

#### Returns

`boolean`

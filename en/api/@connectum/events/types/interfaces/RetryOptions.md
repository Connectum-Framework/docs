[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / RetryOptions

# Interface: RetryOptions

Defined in: [packages/events/src/types.ts:207](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L207)

Retry middleware options

## Properties

### backoff?

> `optional` **backoff**: `"exponential"` \| `"linear"` \| `"fixed"`

Defined in: [packages/events/src/types.ts:211](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L211)

Backoff strategy

***

### initialDelay?

> `optional` **initialDelay**: `number`

Defined in: [packages/events/src/types.ts:213](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L213)

Initial delay in ms (default: 1000)

***

### maxDelay?

> `optional` **maxDelay**: `number`

Defined in: [packages/events/src/types.ts:215](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L215)

Maximum delay in ms (default: 30000)

***

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [packages/events/src/types.ts:209](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L209)

Maximum retry attempts (default: 3)

***

### multiplier?

> `optional` **multiplier**: `number`

Defined in: [packages/events/src/types.ts:217](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L217)

Multiplier for exponential backoff (default: 2)

***

### retryableErrors()?

> `optional` **retryableErrors**: (`error`) => `boolean`

Defined in: [packages/events/src/types.ts:219](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L219)

Filter: only retry for these error types

#### Parameters

##### error

`unknown`

#### Returns

`boolean`

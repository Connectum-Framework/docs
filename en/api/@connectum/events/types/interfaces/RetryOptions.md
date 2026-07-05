[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / RetryOptions

# Interface: RetryOptions

Defined in: [packages/events/src/types.ts:279](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L279)

Retry middleware options

## Properties

### backoff?

> `optional` **backoff?**: `"fixed"` \| `"exponential"` \| `"linear"`

Defined in: [packages/events/src/types.ts:283](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L283)

Backoff strategy

***

### initialDelay?

> `optional` **initialDelay?**: `number`

Defined in: [packages/events/src/types.ts:285](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L285)

Initial delay in ms (default: 1000)

***

### maxDelay?

> `optional` **maxDelay?**: `number`

Defined in: [packages/events/src/types.ts:287](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L287)

Maximum delay in ms (default: 30000)

***

### maxRetries?

> `optional` **maxRetries?**: `number`

Defined in: [packages/events/src/types.ts:281](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L281)

Maximum retry attempts (default: 3)

***

### multiplier?

> `optional` **multiplier?**: `number`

Defined in: [packages/events/src/types.ts:289](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L289)

Multiplier for exponential backoff (default: 2)

***

### retryableErrors?

> `optional` **retryableErrors?**: (`error`) => `boolean`

Defined in: [packages/events/src/types.ts:291](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L291)

Filter: only retry for these error types

#### Parameters

##### error

`unknown`

#### Returns

`boolean`

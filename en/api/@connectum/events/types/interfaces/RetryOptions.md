[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / RetryOptions

# Interface: RetryOptions

Defined in: [packages/events/src/types.ts:264](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L264)

Retry middleware options

## Properties

### backoff?

> `optional` **backoff?**: `"fixed"` \| `"exponential"` \| `"linear"`

Defined in: [packages/events/src/types.ts:268](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L268)

Backoff strategy

***

### initialDelay?

> `optional` **initialDelay?**: `number`

Defined in: [packages/events/src/types.ts:270](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L270)

Initial delay in ms (default: 1000)

***

### maxDelay?

> `optional` **maxDelay?**: `number`

Defined in: [packages/events/src/types.ts:272](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L272)

Maximum delay in ms (default: 30000)

***

### maxRetries?

> `optional` **maxRetries?**: `number`

Defined in: [packages/events/src/types.ts:266](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L266)

Maximum retry attempts (default: 3)

***

### multiplier?

> `optional` **multiplier?**: `number`

Defined in: [packages/events/src/types.ts:274](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L274)

Multiplier for exponential backoff (default: 2)

***

### retryableErrors?

> `optional` **retryableErrors?**: (`error`) => `boolean`

Defined in: [packages/events/src/types.ts:276](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L276)

Filter: only retry for these error types

#### Parameters

##### error

`unknown`

#### Returns

`boolean`

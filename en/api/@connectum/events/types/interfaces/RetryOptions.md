[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / RetryOptions

# Interface: RetryOptions

Defined in: [packages/events/src/types.ts:234](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L234)

Retry middleware options

## Properties

### backoff?

> `optional` **backoff**: `"exponential"` \| `"linear"` \| `"fixed"`

Defined in: [packages/events/src/types.ts:238](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L238)

Backoff strategy

***

### initialDelay?

> `optional` **initialDelay**: `number`

Defined in: [packages/events/src/types.ts:240](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L240)

Initial delay in ms (default: 1000)

***

### maxDelay?

> `optional` **maxDelay**: `number`

Defined in: [packages/events/src/types.ts:242](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L242)

Maximum delay in ms (default: 30000)

***

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [packages/events/src/types.ts:236](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L236)

Maximum retry attempts (default: 3)

***

### multiplier?

> `optional` **multiplier**: `number`

Defined in: [packages/events/src/types.ts:244](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L244)

Multiplier for exponential backoff (default: 2)

***

### retryableErrors()?

> `optional` **retryableErrors**: (`error`) => `boolean`

Defined in: [packages/events/src/types.ts:246](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L246)

Filter: only retry for these error types

#### Parameters

##### error

`unknown`

#### Returns

`boolean`

[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / RetryOptions

# Interface: RetryOptions

Defined in: [packages/events/src/types.ts:249](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/events/src/types.ts#L249)

Retry middleware options

## Properties

### backoff?

> `optional` **backoff?**: `"fixed"` \| `"exponential"` \| `"linear"`

Defined in: [packages/events/src/types.ts:253](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/events/src/types.ts#L253)

Backoff strategy

***

### initialDelay?

> `optional` **initialDelay?**: `number`

Defined in: [packages/events/src/types.ts:255](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/events/src/types.ts#L255)

Initial delay in ms (default: 1000)

***

### maxDelay?

> `optional` **maxDelay?**: `number`

Defined in: [packages/events/src/types.ts:257](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/events/src/types.ts#L257)

Maximum delay in ms (default: 30000)

***

### maxRetries?

> `optional` **maxRetries?**: `number`

Defined in: [packages/events/src/types.ts:251](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/events/src/types.ts#L251)

Maximum retry attempts (default: 3)

***

### multiplier?

> `optional` **multiplier?**: `number`

Defined in: [packages/events/src/types.ts:259](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/events/src/types.ts#L259)

Multiplier for exponential backoff (default: 2)

***

### retryableErrors?

> `optional` **retryableErrors?**: (`error`) => `boolean`

Defined in: [packages/events/src/types.ts:261](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/events/src/types.ts#L261)

Filter: only retry for these error types

#### Parameters

##### error

`unknown`

#### Returns

`boolean`

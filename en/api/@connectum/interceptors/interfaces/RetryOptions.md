[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / RetryOptions

# Interface: RetryOptions

Defined in: [types.ts:157](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L157)

Retry interceptor options

## Properties

### initialDelay?

> `optional` **initialDelay?**: `number`

Defined in: [types.ts:172](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L172)

Initial scale in milliseconds for exponential decorrelated jitter.
Actual retry delays are randomized rather than a fixed sequence.
Integer from 0 to 2147483647 (the platform timer ceiling).

#### Default

```ts
200
```

***

### maxDelay?

> `optional` **maxDelay?**: `number`

Defined in: [types.ts:179](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L179)

Maximum delay in milliseconds for exponential backoff.
Integer from 0 to 2147483647 (the platform timer ceiling).

#### Default

```ts
5000
```

***

### maxRetries?

> `optional` **maxRetries?**: `number`

Defined in: [types.ts:164](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L164)

Maximum number of retries after the initial attempt.
Non-negative finite fractional values retain the retry-count comparison:
for example, 0.5 allows one retry. NaN, Infinity and negative values are refused.

#### Default

```ts
3
```

***

### retryableCodes?

> `optional` **retryableCodes?**: `Code`[]

Defined in: [types.ts:192](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L192)

Error codes that trigger a retry

#### Default

```ts
[Code.Unavailable, Code.ResourceExhausted]
```

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:186](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L186)

Skip retry for streaming requests. If false, retry covers opening the
response, not failures during iteration of an already opened stream.

#### Default

```ts
true
```

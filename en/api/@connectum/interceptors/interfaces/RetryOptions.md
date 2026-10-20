[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / RetryOptions

# Interface: RetryOptions

Defined in: [types.ts:146](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L146)

Retry interceptor options

## Properties

### initialDelay?

> `optional` **initialDelay?**: `number`

Defined in: [types.ts:161](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L161)

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

Defined in: [types.ts:168](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L168)

Maximum delay in milliseconds for exponential backoff.
Integer from 0 to 2147483647 (the platform timer ceiling).

#### Default

```ts
5000
```

***

### maxRetries?

> `optional` **maxRetries?**: `number`

Defined in: [types.ts:153](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L153)

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

Defined in: [types.ts:181](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L181)

Error codes that trigger a retry

#### Default

```ts
[Code.Unavailable, Code.ResourceExhausted]
```

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:175](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L175)

Skip retry for streaming requests. If false, retry covers opening the
response, not failures during iteration of an already opened stream.

#### Default

```ts
true
```

[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / RetryOptions

# Interface: RetryOptions

Defined in: [types.ts:121](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L121)

Retry interceptor options

## Properties

### initialDelay?

> `optional` **initialDelay?**: `number`

Defined in: [types.ts:135](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L135)

Initial scale in milliseconds for exponential decorrelated jitter.
Actual retry delays are randomized rather than a fixed sequence.

#### Default

```ts
200
```

***

### maxDelay?

> `optional` **maxDelay?**: `number`

Defined in: [types.ts:141](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L141)

Maximum delay in milliseconds for exponential backoff

#### Default

```ts
5000
```

***

### maxRetries?

> `optional` **maxRetries?**: `number`

Defined in: [types.ts:128](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L128)

Maximum number of retries after the initial attempt.
Non-negative finite fractional values retain the retry-count comparison:
for example, 0.5 allows one retry.

#### Default

```ts
3
```

***

### retryableCodes?

> `optional` **retryableCodes?**: `Code`[]

Defined in: [types.ts:154](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L154)

Error codes that trigger a retry

#### Default

```ts
[Code.Unavailable, Code.ResourceExhausted]
```

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:148](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L148)

Skip retry for streaming requests. If false, retry covers opening the
response, not failures during iteration of an already opened stream.

#### Default

```ts
true
```

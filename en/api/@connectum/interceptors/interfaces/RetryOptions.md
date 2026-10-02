[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / RetryOptions

# Interface: RetryOptions

Defined in: [types.ts:106](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L106)

Retry interceptor options

## Properties

### initialDelay?

> `optional` **initialDelay?**: `number`

Defined in: [types.ts:117](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L117)

Initial delay in milliseconds for exponential backoff

#### Default

```ts
200
```

***

### maxDelay?

> `optional` **maxDelay?**: `number`

Defined in: [types.ts:123](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L123)

Maximum delay in milliseconds for exponential backoff

#### Default

```ts
5000
```

***

### maxRetries?

> `optional` **maxRetries?**: `number`

Defined in: [types.ts:111](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L111)

Maximum number of retries

#### Default

```ts
3
```

***

### retryableCodes?

> `optional` **retryableCodes?**: `Code`[]

Defined in: [types.ts:135](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L135)

Error codes that trigger a retry

#### Default

```ts
[Code.Unavailable, Code.ResourceExhausted]
```

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:129](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L129)

Skip retry for streaming requests

#### Default

```ts
true
```

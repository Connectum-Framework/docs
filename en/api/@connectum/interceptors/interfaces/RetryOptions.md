[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / RetryOptions

# Interface: RetryOptions

Defined in: [types.ts:120](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L120)

Retry interceptor options

## Properties

### initialDelay?

> `optional` **initialDelay?**: `number`

Defined in: [types.ts:131](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L131)

Initial delay in milliseconds for exponential backoff

#### Default

```ts
200
```

***

### maxDelay?

> `optional` **maxDelay?**: `number`

Defined in: [types.ts:137](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L137)

Maximum delay in milliseconds for exponential backoff

#### Default

```ts
5000
```

***

### maxRetries?

> `optional` **maxRetries?**: `number`

Defined in: [types.ts:125](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L125)

Maximum number of retries

#### Default

```ts
3
```

***

### retryableCodes?

> `optional` **retryableCodes?**: `Code`[]

Defined in: [types.ts:149](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L149)

Error codes that trigger a retry

#### Default

```ts
[Code.Unavailable, Code.ResourceExhausted]
```

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:143](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L143)

Skip retry for streaming requests

#### Default

```ts
true
```

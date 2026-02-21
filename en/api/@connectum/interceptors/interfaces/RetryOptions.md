[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / RetryOptions

# Interface: RetryOptions

Defined in: [types.ts:91](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/types.ts#L91)

Retry interceptor options

## Properties

### initialDelay?

> `optional` **initialDelay**: `number`

Defined in: [types.ts:102](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/types.ts#L102)

Initial delay in milliseconds for exponential backoff

#### Default

```ts
200
```

***

### maxDelay?

> `optional` **maxDelay**: `number`

Defined in: [types.ts:108](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/types.ts#L108)

Maximum delay in milliseconds for exponential backoff

#### Default

```ts
5000
```

***

### maxRetries?

> `optional` **maxRetries**: `number`

Defined in: [types.ts:96](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/types.ts#L96)

Maximum number of retries

#### Default

```ts
3
```

***

### retryableCodes?

> `optional` **retryableCodes**: `Code`[]

Defined in: [types.ts:120](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/types.ts#L120)

Error codes that trigger a retry

#### Default

```ts
[Code.Unavailable, Code.ResourceExhausted]
```

***

### skipStreaming?

> `optional` **skipStreaming**: `boolean`

Defined in: [types.ts:114](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/types.ts#L114)

Skip retry for streaming requests

#### Default

```ts
true
```

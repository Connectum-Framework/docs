[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / CircuitBreakerOptions

# Interface: CircuitBreakerOptions

Defined in: [types.ts:126](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/types.ts#L126)

Circuit breaker interceptor options

## Properties

### halfOpenAfter?

> `optional` **halfOpenAfter**: `number`

Defined in: [types.ts:137](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/types.ts#L137)

Time in milliseconds to wait before attempting to close circuit

#### Default

```ts
30000 (30 seconds)
```

***

### skipStreaming?

> `optional` **skipStreaming**: `boolean`

Defined in: [types.ts:143](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/types.ts#L143)

Skip circuit breaker for streaming calls

#### Default

```ts
true
```

***

### threshold?

> `optional` **threshold**: `number`

Defined in: [types.ts:131](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/interceptors/src/types.ts#L131)

Number of consecutive failures before opening circuit

#### Default

```ts
5
```

[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / CircuitBreakerOptions

# Interface: CircuitBreakerOptions

Defined in: [types.ts:198](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L198)

Circuit breaker interceptor options

## Properties

### failurePredicate?

> `optional` **failurePredicate?**: (`error`, `defaultPredicate`) => `boolean`

Defined in: [types.ts:246](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L246)

Decides whether an error counts as a circuit failure.

Receives the default predicate as the second argument so the default
policy can be composed (extended or restricted) instead of reimplemented:

```typescript
// Extend: also trip on NotFound
failurePredicate: (err, def) =>
    def(err) || (err instanceof ConnectError && err.code === Code.NotFound)

// Restrict: never trip on ResourceExhausted (e.g. upstream rate limits)
failurePredicate: (err, def) =>
    def(err) && !(err instanceof ConnectError && err.code === Code.ResourceExhausted)

// Legacy behavior: every error trips the breaker
failurePredicate: () => true
```

Errors NOT classified as failures never open or re-arm the breaker and,
in half-open state, close the circuit (treated as a successful probe).
A predicate that throws is treated as if it returned `true` (fail-closed);
the original upstream error is always the one propagated to the caller.

#### Parameters

##### error

`unknown`

##### defaultPredicate

(`error`) => `boolean`

#### Returns

`boolean`

#### Default

```ts
defaultFailurePredicate (infrastructure codes only: Unknown,
DeadlineExceeded, Internal, Unavailable, DataLoss, ResourceExhausted;
non-ConnectError values count as failures)
```

***

### halfOpenAfter?

> `optional` **halfOpenAfter?**: `number`

Defined in: [types.ts:210](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L210)

Time in milliseconds to wait before attempting to close circuit.
Integer from 0 to 2147483647 (the platform timer ceiling).

#### Default

```ts
30000 (30 seconds)
```

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:216](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L216)

Skip circuit breaker for streaming calls

#### Default

```ts
true
```

***

### threshold?

> `optional` **threshold?**: `number`

Defined in: [types.ts:203](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L203)

Number of consecutive failures before opening circuit. Integer of at least 1.

#### Default

```ts
5
```

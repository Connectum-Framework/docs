[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / CacheOptions

# Interface: CacheOptions

Defined in: [packages/auth/src/types.ts:112](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L112)

LRU cache configuration for credentials verification

## Properties

### maxSize?

> `readonly` `optional` **maxSize?**: `number`

Defined in: [packages/auth/src/types.ts:123](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L123)

Maximum number of cached entries. Must be an integer of at least 1;
anything else throws `RangeError` when the interceptor is created.

#### Default

```ts
1000
```

***

### ttl

> `readonly` **ttl**: `number`

Defined in: [packages/auth/src/types.ts:117](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L117)

Cache entry time-to-live in milliseconds. Must be finite and greater than 0;
anything else (0, negative, `NaN`, `Infinity`) throws `RangeError` when the interceptor is created.

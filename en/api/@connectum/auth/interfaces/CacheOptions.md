[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / CacheOptions

# Interface: CacheOptions

Defined in: [packages/auth/src/types.ts:105](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L105)

LRU cache configuration for credentials verification

## Properties

### maxSize?

> `readonly` `optional` **maxSize**: `number`

Defined in: [packages/auth/src/types.ts:109](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L109)

Maximum number of cached entries

***

### ttl

> `readonly` **ttl**: `number`

Defined in: [packages/auth/src/types.ts:107](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L107)

Cache entry time-to-live in milliseconds

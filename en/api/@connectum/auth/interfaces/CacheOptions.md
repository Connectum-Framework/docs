[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / CacheOptions

# Interface: CacheOptions

Defined in: [packages/auth/src/types.ts:105](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/auth/src/types.ts#L105)

LRU cache configuration for credentials verification

## Properties

### maxSize?

> `readonly` `optional` **maxSize**: `number`

Defined in: [packages/auth/src/types.ts:109](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/auth/src/types.ts#L109)

Maximum number of cached entries

***

### ttl

> `readonly` **ttl**: `number`

Defined in: [packages/auth/src/types.ts:107](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/auth/src/types.ts#L107)

Cache entry time-to-live in milliseconds

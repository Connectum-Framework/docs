[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / CacheOptions

# Interface: CacheOptions

Defined in: [packages/auth/src/types.ts:105](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/auth/src/types.ts#L105)

LRU cache configuration for credentials verification

## Properties

### maxSize?

> `readonly` `optional` **maxSize**: `number`

Defined in: [packages/auth/src/types.ts:109](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/auth/src/types.ts#L109)

Maximum number of cached entries

***

### ttl

> `readonly` **ttl**: `number`

Defined in: [packages/auth/src/types.ts:107](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/auth/src/types.ts#L107)

Cache entry time-to-live in milliseconds

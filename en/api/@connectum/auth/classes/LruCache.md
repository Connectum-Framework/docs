[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / LruCache

# Class: LruCache\<T\>

Defined in: [packages/auth/src/cache.ts:13](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/cache.ts#L13)

## Type Parameters

### T

`T`

## Constructors

### Constructor

> **new LruCache**\<`T`\>(`options`): `LruCache`\<`T`\>

Defined in: [packages/auth/src/cache.ts:18](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/cache.ts#L18)

#### Parameters

##### options

###### maxSize?

`number`

###### ttl

`number`

#### Returns

`LruCache`\<`T`\>

## Accessors

### size

#### Get Signature

> **get** **size**(): `number`

Defined in: [packages/auth/src/cache.ts:63](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/cache.ts#L63)

##### Returns

`number`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/auth/src/cache.ts:59](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/cache.ts#L59)

#### Returns

`void`

***

### get()

> **get**(`key`): `T` \| `undefined`

Defined in: [packages/auth/src/cache.ts:26](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/cache.ts#L26)

#### Parameters

##### key

`string`

#### Returns

`T` \| `undefined`

***

### set()

> **set**(`key`, `value`): `void`

Defined in: [packages/auth/src/cache.ts:41](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/cache.ts#L41)

#### Parameters

##### key

`string`

##### value

`T`

#### Returns

`void`

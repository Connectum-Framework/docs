[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / LruCache

# Class: LruCache\<T\>

Defined in: [packages/auth/src/cache.ts:13](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/cache.ts#L13)

## Type Parameters

### T

`T`

## Constructors

### Constructor

> **new LruCache**\<`T`\>(`options`): `LruCache`\<`T`\>

Defined in: [packages/auth/src/cache.ts:18](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/cache.ts#L18)

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

Defined in: [packages/auth/src/cache.ts:72](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/cache.ts#L72)

##### Returns

`number`

## Methods

### clear()

> **clear**(): `void`

Defined in: [packages/auth/src/cache.ts:68](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/cache.ts#L68)

#### Returns

`void`

***

### get()

> **get**(`key`): `T` \| `undefined`

Defined in: [packages/auth/src/cache.ts:35](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/cache.ts#L35)

#### Parameters

##### key

`string`

#### Returns

`T` \| `undefined`

***

### set()

> **set**(`key`, `value`): `void`

Defined in: [packages/auth/src/cache.ts:50](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/cache.ts#L50)

#### Parameters

##### key

`string`

##### value

`T`

#### Returns

`void`

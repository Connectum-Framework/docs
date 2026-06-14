[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / FallbackOptions

# Interface: FallbackOptions\<T\>

Defined in: [types.ts:219](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/interceptors/src/types.ts#L219)

Fallback interceptor options

## Type Parameters

### T

`T` = `unknown`

## Properties

### handler

> **handler**: (`error`) => `T` \| `Promise`\<`T`\>

Defined in: [types.ts:223](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/interceptors/src/types.ts#L223)

Fallback function to call on error

#### Parameters

##### error

`Error`

#### Returns

`T` \| `Promise`\<`T`\>

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:229](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/interceptors/src/types.ts#L229)

Skip fallback for streaming calls

#### Default

```ts
true
```

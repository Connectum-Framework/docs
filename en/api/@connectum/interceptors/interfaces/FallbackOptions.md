[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / FallbackOptions

# Interface: FallbackOptions\<T\>

Defined in: [types.ts:234](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L234)

Fallback interceptor options

## Type Parameters

### T

`T` = `unknown`

## Properties

### handler

> **handler**: (`error`) => `T` \| `Promise`\<`T`\>

Defined in: [types.ts:238](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L238)

Fallback function to call on error

#### Parameters

##### error

`Error`

#### Returns

`T` \| `Promise`\<`T`\>

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:244](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L244)

Skip fallback for streaming calls

#### Default

```ts
true
```

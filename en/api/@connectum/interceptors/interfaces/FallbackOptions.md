[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / FallbackOptions

# Interface: FallbackOptions\<T\>

Defined in: [types.ts:189](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/interceptors/src/types.ts#L189)

Fallback interceptor options

## Type Parameters

### T

`T` = `unknown`

## Properties

### handler()

> **handler**: (`error`) => `T` \| `Promise`\<`T`\>

Defined in: [types.ts:193](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/interceptors/src/types.ts#L193)

Fallback function to call on error

#### Parameters

##### error

`Error`

#### Returns

`T` \| `Promise`\<`T`\>

***

### skipStreaming?

> `optional` **skipStreaming**: `boolean`

Defined in: [types.ts:199](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/interceptors/src/types.ts#L199)

Skip fallback for streaming calls

#### Default

```ts
true
```

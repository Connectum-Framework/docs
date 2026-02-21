[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / FallbackOptions

# Interface: FallbackOptions\<T\>

Defined in: [types.ts:189](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/interceptors/src/types.ts#L189)

Fallback interceptor options

## Type Parameters

### T

`T` = `unknown`

## Properties

### handler()

> **handler**: (`error`) => `T` \| `Promise`\<`T`\>

Defined in: [types.ts:193](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/interceptors/src/types.ts#L193)

Fallback function to call on error

#### Parameters

##### error

`Error`

#### Returns

`T` \| `Promise`\<`T`\>

***

### skipStreaming?

> `optional` **skipStreaming**: `boolean`

Defined in: [types.ts:199](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/interceptors/src/types.ts#L199)

Skip fallback for streaming calls

#### Default

```ts
true
```

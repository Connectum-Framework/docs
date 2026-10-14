[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / FallbackOptions

# Interface: FallbackOptions\<T\>

Defined in: [types.ts:281](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L281)

Fallback interceptor options

## Type Parameters

### T

`T` = `unknown`

## Properties

### handler

> **handler**: (`error`) => `T` \| `Promise`\<`T`\>

Defined in: [types.ts:285](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L285)

Fallback function to call on error

#### Parameters

##### error

`Error`

#### Returns

`T` \| `Promise`\<`T`\>

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:291](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L291)

Skip fallback for streaming calls

#### Default

```ts
true
```

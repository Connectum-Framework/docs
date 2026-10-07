[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / FallbackOptions

# Interface: FallbackOptions\<T\>

Defined in: [types.ts:256](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L256)

Fallback interceptor options

## Type Parameters

### T

`T` = `unknown`

## Properties

### handler

> **handler**: (`error`) => `T` \| `Promise`\<`T`\>

Defined in: [types.ts:260](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L260)

Fallback function to call on error

#### Parameters

##### error

`Error`

#### Returns

`T` \| `Promise`\<`T`\>

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:266](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L266)

Skip fallback for streaming calls

#### Default

```ts
true
```

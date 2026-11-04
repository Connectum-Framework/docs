[Connectum API Reference](../../../index.md) / [@connectum/interceptors](../index.md) / FallbackOptions

# Interface: FallbackOptions\<T\>

Defined in: [types.ts:298](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L298)

Fallback interceptor options

## Type Parameters

### T

`T` = `unknown`

## Properties

### handler

> **handler**: (`error`) => `T` \| `Promise`\<`T`\>

Defined in: [types.ts:315](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L315)

Fallback function to call on error.

Returns the response message of the method being called: a message created for
its output type, or a plain object holding that message's fields (a oneof is set
as `{ case, value }` under the oneof's name). A plain object is checked field by
field: `undefined`, `null`, a key that is not a field, a value of another kind than
its field takes (a number in a string field, a non-boolean in a bool field, a
non-array in a repeated field), a map key that is not in the canonical form of its
key type (`"01"` for an int32, `"yes"` for a bool), a string with a lone surrogate,
bytes that are not a `Uint8Array` or an array of integers 0 to 255, a non-canonical
string for a 64-bit integer and a number the encoder cannot write fail the call
with a `TypeError` naming the expected type and the path of the problem. Fields use
the protobuf-es forms: a wrapper such as `StringValue` in a singular field outside a
oneof is its bare value, and a `Struct` is a plain JSON object.

#### Parameters

##### error

`Error`

#### Returns

`T` \| `Promise`\<`T`\>

***

### skipStreaming?

> `optional` **skipStreaming?**: `boolean`

Defined in: [types.ts:325](https://github.com/Connectum-Framework/connectum/blob/main/packages/interceptors/src/types.ts#L325)

Skip fallback for streaming calls. If false, the fallback covers a streaming
call whose opening fails, and the `handler`'s message becomes the call's only
message (the single response of a client-streaming call). A failure after the
response has opened, while its messages are being read, is not replaced and
reaches the caller as it is.

#### Default

```ts
true
```

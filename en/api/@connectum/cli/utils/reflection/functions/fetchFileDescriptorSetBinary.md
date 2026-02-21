[Connectum API Reference](../../../../../index.md) / [@connectum/cli](../../../index.md) / [utils/reflection](../index.md) / fetchFileDescriptorSetBinary

# Function: fetchFileDescriptorSetBinary()

> **fetchFileDescriptorSetBinary**(`url`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [utils/reflection.ts:72](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/cli/src/utils/reflection.ts#L72)

Fetch FileDescriptorSet as binary (.binpb) from a running server via reflection.

The binary output can be passed directly to `buf generate` as input.

## Parameters

### url

`string`

Server URL (e.g., "http://localhost:5000")

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Binary FileDescriptorSet (.binpb format)

## Example

```typescript
const binpb = await fetchFileDescriptorSetBinary("http://localhost:5000");
writeFileSync("/tmp/descriptors.binpb", binpb);
// Then: buf generate /tmp/descriptors.binpb --output ./gen
```

[Connectum API Reference](../../../../../index.md) / [@connectum/cli](../../../index.md) / [utils/reflection](../index.md) / fetchFileDescriptorSetBinary

# Function: fetchFileDescriptorSetBinary()

> **fetchFileDescriptorSetBinary**(`url`, `options?`): `Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Defined in: [utils/reflection.ts:283](https://github.com/Connectum-Framework/connectum/blob/main/packages/cli/src/utils/reflection.ts#L283)

Fetch FileDescriptorSet as binary (.binpb) from a running server via reflection.

The binary output can be passed directly to `buf generate` as input. The same completeness
and time-limit rules as [fetchReflectionData](fetchReflectionData.md) apply.

## Parameters

### url

`string`

Server URL (e.g., "http://localhost:5000")

### options?

[`ReflectionOptions`](../interfaces/ReflectionOptions.md) = `{}`

Time limit of each request

## Returns

`Promise`\<`Uint8Array`\<`ArrayBufferLike`\>\>

Binary FileDescriptorSet (.binpb format)

## Example

```typescript
import { mkdirSync, writeFileSync } from "node:fs";
import { fetchFileDescriptorSetBinary } from "@connectum/cli/utils/reflection";

const binpb = await fetchFileDescriptorSetBinary("http://localhost:5000");
mkdirSync(".tmp", { recursive: true });
writeFileSync(".tmp/descriptors.binpb", binpb);
// Then: buf generate .tmp/descriptors.binpb --output ./gen
```

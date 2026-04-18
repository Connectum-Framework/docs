[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / BooleanFromStringSchema

# Variable: BooleanFromStringSchema

> `const` **BooleanFromStringSchema**: `ZodPipe`\<`ZodDefault`\<`ZodEnum`\<\{ `0`: `"0"`; `1`: `"1"`; `false`: `"false"`; `no`: `"no"`; `true`: `"true"`; `yes`: `"yes"`; \}\>\>, `ZodTransform`\<`boolean`, `"0"` \| `"1"` \| `"true"` \| `"false"` \| `"yes"` \| `"no"`\>\>

Defined in: [packages/core/src/config/envSchema.ts:35](https://github.com/Connectum-Framework/connectum/blob/638fd0bfcd1daf229a925892579ece032b17742c/packages/core/src/config/envSchema.ts#L35)

Boolean from string schema (for ENV variables)

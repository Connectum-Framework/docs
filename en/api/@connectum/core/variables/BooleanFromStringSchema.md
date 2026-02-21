[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / BooleanFromStringSchema

# Variable: BooleanFromStringSchema

> `const` **BooleanFromStringSchema**: `ZodPipe`\<`ZodDefault`\<`ZodEnum`\<\{ `0`: `"0"`; `1`: `"1"`; `false`: `"false"`; `no`: `"no"`; `true`: `"true"`; `yes`: `"yes"`; \}\>\>, `ZodTransform`\<`boolean`, `"0"` \| `"1"` \| `"true"` \| `"false"` \| `"yes"` \| `"no"`\>\>

Defined in: [packages/core/src/config/envSchema.ts:35](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/core/src/config/envSchema.ts#L35)

Boolean from string schema (for ENV variables)

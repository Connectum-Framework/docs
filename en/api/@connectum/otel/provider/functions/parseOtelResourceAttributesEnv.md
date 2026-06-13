[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / parseOtelResourceAttributesEnv

# Function: parseOtelResourceAttributesEnv()

> **parseOtelResourceAttributesEnv**(`raw`): `Record`\<`string`, `string`\>

Defined in: [packages/otel/src/provider.ts:62](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/otel/src/provider.ts#L62)

Parse the standard `OTEL_RESOURCE_ATTRIBUTES` env var
(`key1=value1,key2=value2`) into an attribute record. Malformed pairs (no
`=`, empty key) are skipped. Values are kept as strings; whitespace around
keys and values is trimmed.

## Parameters

### raw

`string` \| `undefined`

## Returns

`Record`\<`string`, `string`\>

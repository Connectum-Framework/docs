[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / parseOtelResourceAttributesEnv

# Function: parseOtelResourceAttributesEnv()

> **parseOtelResourceAttributesEnv**(`raw`): `Record`\<`string`, `string`\>

Defined in: [provider.ts:163](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L163)

Parse the standard `OTEL_RESOURCE_ATTRIBUTES` env var
(`key1=value1,key2=value2`) into an attribute record. Malformed pairs (no
`=`, empty key) are skipped. Values are kept as strings; whitespace around
keys and values is trimmed.

Keys and values are percent-decoded, as the OpenTelemetry Resource SDK
specification requires: `,` and `=` inside a key or value are written `%2C` and
`%3D`. The text is split on the raw separators first, so an encoded comma stays
in its value; `+` is not a space. When a part is not valid percent-encoding the
whole variable is discarded: this returns `{}` and emits a process warning (code
`CONNECTUM_OTEL_INVALID_ENV`) naming the variable.

## Parameters

### raw

`string` \| `undefined`

## Returns

`Record`\<`string`, `string`\>

[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / buildResourceAttributes

# Function: buildResourceAttributes()

> **buildResourceAttributes**(`inputs`): `Record`\<`string`, `string` \| `number` \| `boolean`\>

Defined in: [packages/otel/src/provider.ts:98](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/otel/src/provider.ts#L98)

Build the flat resource-attribute record shared by traces, metrics, and logs.

Precedence (lowest to highest): `service.name`/`service.version` → env
(`OTEL_RESOURCE_ATTRIBUTES`, `OTEL_SERVICE_INSTANCE_ID`) → explicit
`resourceAttributes` → explicit `instanceId`.

## Parameters

### inputs

[`ResourceAttributeInputs`](../interfaces/ResourceAttributeInputs.md)

## Returns

`Record`\<`string`, `string` \| `number` \| `boolean`\>

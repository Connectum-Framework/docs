[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / buildResourceAttributes

# Function: buildResourceAttributes()

> **buildResourceAttributes**(`inputs`): `Record`\<`string`, `string` \| `number` \| `boolean`\>

Defined in: [provider.ts:103](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L103)

Build the flat resource-attribute record shared by traces, metrics, and logs.

Precedence (lowest to highest): `service.name`/`service.version` → env
(`OTEL_RESOURCE_ATTRIBUTES`, `OTEL_SERVICE_INSTANCE_ID`) → explicit
`resourceAttributes` → explicit `instanceId`.

## Parameters

### inputs

[`ResourceAttributeInputs`](../interfaces/ResourceAttributeInputs.md)

## Returns

`Record`\<`string`, `string` \| `number` \| `boolean`\>

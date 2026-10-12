[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / buildResourceAttributes

# Function: buildResourceAttributes()

> **buildResourceAttributes**(`inputs`): `Record`\<`string`, `string` \| `number` \| `boolean`\>

Defined in: [provider.ts:137](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L137)

Build the flat resource-attribute record shared by traces, metrics, and logs.

Precedence (lowest to highest): `service.version` → env
(`OTEL_RESOURCE_ATTRIBUTES`, `OTEL_SERVICE_INSTANCE_ID`) → explicit
`resourceAttributes` → explicit `instanceId`. `service.name` is the already
resolved `serviceName` and is never overridden by the env attributes.

## Parameters

### inputs

[`ResourceAttributeInputs`](../interfaces/ResourceAttributeInputs.md)

## Returns

`Record`\<`string`, `string` \| `number` \| `boolean`\>

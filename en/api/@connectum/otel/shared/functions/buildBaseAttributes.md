[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / buildBaseAttributes

# Function: buildBaseAttributes()

> **buildBaseAttributes**(`params`): `Record`\<`string`, `string` \| `number`\>

Defined in: [packages/otel/src/shared.ts:158](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/shared.ts#L158)

Builds standard RPC base attributes per OTel semantic conventions.

## Parameters

### params

[`BaseAttributeParams`](../interfaces/BaseAttributeParams.md)

Service, method, server address/port info

## Returns

`Record`\<`string`, `string` \| `number`\>

Record of base attributes

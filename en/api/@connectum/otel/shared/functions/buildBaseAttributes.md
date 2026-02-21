[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / buildBaseAttributes

# Function: buildBaseAttributes()

> **buildBaseAttributes**(`params`): `Record`\<`string`, `string` \| `number`\>

Defined in: [packages/otel/src/shared.ts:158](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/otel/src/shared.ts#L158)

Builds standard RPC base attributes per OTel semantic conventions.

## Parameters

### params

[`BaseAttributeParams`](../interfaces/BaseAttributeParams.md)

Service, method, server address/port info

## Returns

`Record`\<`string`, `string` \| `number`\>

Record of base attributes

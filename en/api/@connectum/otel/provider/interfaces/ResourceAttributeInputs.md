[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / ResourceAttributeInputs

# Interface: ResourceAttributeInputs

Defined in: [provider.ts:206](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L206)

Inputs for [buildResourceAttributes](../functions/buildResourceAttributes.md).

## Properties

### env?

> `optional` **env?**: `object`

Defined in: [provider.ts:213](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L213)

Environment source (defaults to `process.env`).

#### OTEL\_RESOURCE\_ATTRIBUTES?

> `optional` **OTEL\_RESOURCE\_ATTRIBUTES?**: `string`

#### OTEL\_SERVICE\_INSTANCE\_ID?

> `optional` **OTEL\_SERVICE\_INSTANCE\_ID?**: `string`

***

### instanceId?

> `optional` **instanceId?**: `string`

Defined in: [provider.ts:210](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L210)

***

### resourceAttributes?

> `optional` **resourceAttributes?**: `Record`\<`string`, `string` \| `number` \| `boolean`\>

Defined in: [provider.ts:211](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L211)

***

### serviceName

> **serviceName**: `string`

Defined in: [provider.ts:208](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L208)

The final service name (see [resolveServiceName](../functions/resolveServiceName.md)); it is not overridden by `OTEL_RESOURCE_ATTRIBUTES`.

***

### serviceVersion

> **serviceVersion**: `string`

Defined in: [provider.ts:209](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L209)

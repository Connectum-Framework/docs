[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / ResourceAttributeInputs

# Interface: ResourceAttributeInputs

Defined in: [provider.ts:87](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L87)

Inputs for [buildResourceAttributes](../functions/buildResourceAttributes.md).

## Properties

### env?

> `optional` **env?**: `object`

Defined in: [provider.ts:93](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L93)

Environment source (defaults to `process.env`).

#### OTEL\_RESOURCE\_ATTRIBUTES?

> `optional` **OTEL\_RESOURCE\_ATTRIBUTES?**: `string`

#### OTEL\_SERVICE\_INSTANCE\_ID?

> `optional` **OTEL\_SERVICE\_INSTANCE\_ID?**: `string`

***

### instanceId?

> `optional` **instanceId?**: `string`

Defined in: [provider.ts:90](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L90)

***

### resourceAttributes?

> `optional` **resourceAttributes?**: `Record`\<`string`, `string` \| `number` \| `boolean`\>

Defined in: [provider.ts:91](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L91)

***

### serviceName

> **serviceName**: `string`

Defined in: [provider.ts:88](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L88)

***

### serviceVersion

> **serviceVersion**: `string`

Defined in: [provider.ts:89](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L89)

[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / ServiceNameInputs

# Interface: ServiceNameInputs

Defined in: [provider.ts:173](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L173)

Inputs for [resolveServiceName](../functions/resolveServiceName.md).

## Properties

### env?

> `optional` **env?**: `object`

Defined in: [provider.ts:177](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L177)

Environment source (defaults to `process.env`).

#### npm\_package\_name?

> `optional` **npm\_package\_name?**: `string`

#### OTEL\_RESOURCE\_ATTRIBUTES?

> `optional` **OTEL\_RESOURCE\_ATTRIBUTES?**: `string`

#### OTEL\_SERVICE\_NAME?

> `optional` **OTEL\_SERVICE\_NAME?**: `string`

***

### explicit?

> `optional` **explicit?**: `string`

Defined in: [provider.ts:175](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L175)

Name passed in code (`ProviderOptions.serviceName`).

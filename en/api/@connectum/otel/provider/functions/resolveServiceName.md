[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / resolveServiceName

# Function: resolveServiceName()

> **resolveServiceName**(`inputs?`): `string`

Defined in: [provider.ts:103](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L103)

Resolve the `service.name` the provider reports.

Precedence (highest first): the explicit `serviceName` option →
`OTEL_SERVICE_NAME` → `service.name` inside `OTEL_RESOURCE_ATTRIBUTES` →
`npm_package_name` → `"unknown-service"`. `OTEL_SERVICE_NAME` outranks the
resource-attributes entry, as the OpenTelemetry SDK environment-variable
specification requires. Empty values are treated as unset.

## Parameters

### inputs?

[`ServiceNameInputs`](../interfaces/ServiceNameInputs.md) = `{}`

## Returns

`string`

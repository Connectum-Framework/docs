[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / getServiceMetadata

# Function: getServiceMetadata()

> **getServiceMetadata**(): `object`

Defined in: [config.ts:207](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/config.ts#L207)

Gets service metadata from environment variables

Uses OTEL_SERVICE_NAME, then npm_package_name, then "unknown-service" for the name.
The version comes from npm_package_version, falling back to "0.0.0".

This reads the process environment only. The service name the provider reports is resolved
separately and also honours the `serviceName` option and the `service.name` entry of
`OTEL_RESOURCE_ATTRIBUTES` (between `OTEL_SERVICE_NAME` and `npm_package_name`), so for a
service configured that way the name returned here is not the one on its telemetry.

## Returns

`object`

Service name and version

### name

> **name**: `string`

### version

> **version**: `string`

[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / getServiceMetadata

# Function: getServiceMetadata()

> **getServiceMetadata**(): `object`

Defined in: [config.ts:171](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/config.ts#L171)

Gets service metadata from environment variables

Uses OTEL_SERVICE_NAME, then npm_package_name, then "unknown-service" for the name.
The version comes from npm_package_version, falling back to "0.0.0".

## Returns

`object`

Service name and version

### name

> **name**: `string`

### version

> **version**: `string`

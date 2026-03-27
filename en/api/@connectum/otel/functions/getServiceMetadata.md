[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / getServiceMetadata

# Function: getServiceMetadata()

> **getServiceMetadata**(): `object`

Defined in: [packages/otel/src/config.ts:116](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/otel/src/config.ts#L116)

Gets service metadata from environment variables

Uses OTEL_SERVICE_NAME as primary source, falls back to npm_package_name.

## Returns

`object`

Service name and version

### name

> **name**: `string`

### version

> **version**: `string`

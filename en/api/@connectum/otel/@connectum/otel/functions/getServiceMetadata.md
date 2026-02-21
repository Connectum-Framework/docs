[Connectum API Reference](../../../../../index.md) / [@connectum/otel](../../../index.md) / [@connectum/otel](../index.md) / getServiceMetadata

# Function: getServiceMetadata()

> **getServiceMetadata**(): `object`

Defined in: [packages/otel/src/config.ts:116](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/otel/src/config.ts#L116)

Gets service metadata from environment variables

Uses OTEL_SERVICE_NAME as primary source, falls back to npm_package_name.

## Returns

`object`

Service name and version

### name

> **name**: `string`

### version

> **version**: `string`

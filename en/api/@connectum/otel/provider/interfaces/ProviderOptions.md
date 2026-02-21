[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / ProviderOptions

# Interface: ProviderOptions

Defined in: [packages/otel/src/provider.ts:31](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/provider.ts#L31)

Options for initializing the OpenTelemetry provider

## Properties

### serviceName?

> `optional` **serviceName**: `string`

Defined in: [packages/otel/src/provider.ts:33](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/provider.ts#L33)

Override service name (defaults to OTEL_SERVICE_NAME or npm_package_name)

***

### serviceVersion?

> `optional` **serviceVersion**: `string`

Defined in: [packages/otel/src/provider.ts:35](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/provider.ts#L35)

Override service version (defaults to npm_package_version)

***

### settings?

> `optional` **settings**: `Partial`\<[`OTLPSettings`](../../interfaces/OTLPSettings.md)\>

Defined in: [packages/otel/src/provider.ts:37](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/provider.ts#L37)

Override OTLP exporter settings (defaults to env-based config)

[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / ProviderOptions

# Interface: ProviderOptions

Defined in: [provider.ts:40](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L40)

Options for initializing the OpenTelemetry provider

## Properties

### instanceId?

> `optional` **instanceId?**: `string`

Defined in: [provider.ts:50](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L50)

Sets `service.instance.id` on the resource (OTel semconv). Lets a fleet of
same-role processes be told apart in telemetry. Takes precedence over the
`OTEL_SERVICE_INSTANCE_ID` env var.

***

### resourceAttributes?

> `optional` **resourceAttributes?**: `Record`\<`string`, `string` \| `number` \| `boolean`\>

Defined in: [provider.ts:56](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L56)

Extra resource attributes merged into the resource (e.g. `device.id`,
`facility`). Applied to traces, metrics, and logs alike. Takes precedence
over attributes parsed from the `OTEL_RESOURCE_ATTRIBUTES` env var.

***

### serviceName?

> `optional` **serviceName?**: `string`

Defined in: [provider.ts:42](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L42)

Override service name (defaults to OTEL_SERVICE_NAME or npm_package_name)

***

### serviceVersion?

> `optional` **serviceVersion?**: `string`

Defined in: [provider.ts:44](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L44)

Override service version (defaults to npm_package_version)

***

### settings?

> `optional` **settings?**: `Partial`\<[`OTLPSettings`](../../interfaces/OTLPSettings.md)\>

Defined in: [provider.ts:58](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L58)

Override OTLP exporter settings (defaults to env-based config)

[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / ProviderOptions

# Interface: ProviderOptions

Defined in: [provider.ts:53](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L53)

Options for initializing the OpenTelemetry provider

## Properties

### instanceId?

> `optional` **instanceId?**: `string`

Defined in: [provider.ts:63](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L63)

Sets `service.instance.id` on the resource (OTel semconv). Lets a fleet of
same-role processes be told apart in telemetry. Takes precedence over the
`OTEL_SERVICE_INSTANCE_ID` env var.

***

### resourceAttributes?

> `optional` **resourceAttributes?**: `Record`\<`string`, `string` \| `number` \| `boolean`\>

Defined in: [provider.ts:69](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L69)

Extra resource attributes merged into the resource (e.g. `device.id`,
`facility`). Applied to traces, metrics, and logs alike. Takes precedence
over attributes parsed from the `OTEL_RESOURCE_ATTRIBUTES` env var.

***

### serviceName?

> `optional` **serviceName?**: `string`

Defined in: [provider.ts:55](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L55)

Override service name (defaults to OTEL_SERVICE_NAME, then service.name in OTEL_RESOURCE_ATTRIBUTES, then npm_package_name)

***

### serviceVersion?

> `optional` **serviceVersion?**: `string`

Defined in: [provider.ts:57](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L57)

Override service version (defaults to npm_package_version)

***

### settings?

> `optional` **settings?**: `Partial`\<[`OTLPSettings`](../../interfaces/OTLPSettings.md)\>

Defined in: [provider.ts:78](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/provider.ts#L78)

Override the exporter of a signal (defaults to the environment, see
[getOTLPSettings](../../functions/getOTLPSettings.md)). `initProvider()` throws `TypeError` for a key other
than `traces`, `metrics` or `logs` and for a value that is not an
[ExporterType](../../variables/ExporterType.md); the bare `otlp` accepted by the environment variables is
not one, use `otlp/http-protobuf`. An entry that is absent or `undefined`
falls back to the environment.

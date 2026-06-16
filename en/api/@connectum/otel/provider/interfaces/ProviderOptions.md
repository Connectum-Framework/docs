[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [provider](../index.md) / ProviderOptions

# Interface: ProviderOptions

Defined in: [packages/otel/src/provider.ts:35](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/otel/src/provider.ts#L35)

Options for initializing the OpenTelemetry provider

## Properties

### instanceId?

> `optional` **instanceId?**: `string`

Defined in: [packages/otel/src/provider.ts:45](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/otel/src/provider.ts#L45)

Sets `service.instance.id` on the resource (OTel semconv). Lets a fleet of
same-role processes be told apart in telemetry. Takes precedence over the
`OTEL_SERVICE_INSTANCE_ID` env var.

***

### resourceAttributes?

> `optional` **resourceAttributes?**: `Record`\<`string`, `string` \| `number` \| `boolean`\>

Defined in: [packages/otel/src/provider.ts:51](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/otel/src/provider.ts#L51)

Extra resource attributes merged into the resource (e.g. `device.id`,
`facility`). Applied to traces, metrics, and logs alike. Takes precedence
over attributes parsed from the `OTEL_RESOURCE_ATTRIBUTES` env var.

***

### serviceName?

> `optional` **serviceName?**: `string`

Defined in: [packages/otel/src/provider.ts:37](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/otel/src/provider.ts#L37)

Override service name (defaults to OTEL_SERVICE_NAME or npm_package_name)

***

### serviceVersion?

> `optional` **serviceVersion?**: `string`

Defined in: [packages/otel/src/provider.ts:39](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/otel/src/provider.ts#L39)

Override service version (defaults to npm_package_version)

***

### settings?

> `optional` **settings?**: `Partial`\<[`OTLPSettings`](../../interfaces/OTLPSettings.md)\>

Defined in: [packages/otel/src/provider.ts:53](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/otel/src/provider.ts#L53)

Override OTLP exporter settings (defaults to env-based config)

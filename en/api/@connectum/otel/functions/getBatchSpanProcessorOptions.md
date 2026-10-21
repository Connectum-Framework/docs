[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / getBatchSpanProcessorOptions

# Function: getBatchSpanProcessorOptions()

> **getBatchSpanProcessorOptions**(): [`BatchSpanProcessorOptions`](../interfaces/BatchSpanProcessorOptions.md)

Defined in: [config.ts:159](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/config.ts#L159)

Gets batch span processor options from environment variables

Environment variables:
- OTEL_BSP_MAX_EXPORT_BATCH_SIZE: Max number of spans to export in a single batch (default: 100)
- OTEL_BSP_MAX_QUEUE_SIZE: Max queue size - if reached, new spans are dropped (default: 1000)
- OTEL_BSP_SCHEDULE_DELAY: Time to wait before automatically exporting spans in ms (default: 1000)
- OTEL_BSP_EXPORT_TIMEOUT: Max time allowed for a single export operation in ms (default: 10000)

A value that is not an integer, or is negative, is ignored with a process warning and the
default is used, as the OpenTelemetry specification asks for invalid numeric
variables. The provider is created lazily on the first traced call, so throwing here
would fail that user call.

## Returns

[`BatchSpanProcessorOptions`](../interfaces/BatchSpanProcessorOptions.md)

Batch span processor options

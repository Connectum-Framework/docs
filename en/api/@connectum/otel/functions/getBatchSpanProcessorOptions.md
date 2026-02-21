[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / getBatchSpanProcessorOptions

# Function: getBatchSpanProcessorOptions()

> **getBatchSpanProcessorOptions**(): [`BatchSpanProcessorOptions`](../interfaces/BatchSpanProcessorOptions.md)

Defined in: [packages/otel/src/config.ts:100](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/config.ts#L100)

Gets batch span processor options from environment variables

Environment variables:
- OTEL_BSP_MAX_EXPORT_BATCH_SIZE: Max number of spans to export in a single batch (default: 100)
- OTEL_BSP_MAX_QUEUE_SIZE: Max queue size - if reached, new spans are dropped (default: 1000)
- OTEL_BSP_SCHEDULE_DELAY: Time to wait before automatically exporting spans in ms (default: 1000)
- OTEL_BSP_EXPORT_TIMEOUT: Max time allowed for a single export operation in ms (default: 10000)

## Returns

[`BatchSpanProcessorOptions`](../interfaces/BatchSpanProcessorOptions.md)

Batch span processor options

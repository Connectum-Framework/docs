[Connectum API Reference](../../../index.md) / [@connectum/otel](../index.md) / getBatchLogRecordProcessorOptions

# Function: getBatchLogRecordProcessorOptions()

> **getBatchLogRecordProcessorOptions**(): [`BatchLogRecordProcessorOptions`](../interfaces/BatchLogRecordProcessorOptions.md)

Defined in: [config.ts:337](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/config.ts#L337)

Gets batch log record processor options from environment variables

`@opentelemetry/sdk-logs` does not read these variables itself, so the provider passes them
to the processor explicitly.

Environment variables:
- OTEL_BLRP_MAX_EXPORT_BATCH_SIZE: Max number of log records in one export request (default: 512)
- OTEL_BLRP_MAX_QUEUE_SIZE: Max queue size - if reached, new log records are dropped (default: 2048)
- OTEL_BLRP_SCHEDULE_DELAY: Time to wait before automatically exporting queued log records in ms (default: 1000)
- OTEL_BLRP_EXPORT_TIMEOUT: Max time allowed for a single export operation in ms (default: 10000)

Invalid values are handled as in [getBatchSpanProcessorOptions](getBatchSpanProcessorOptions.md): a warning and the
default. A batch or queue size must be at least 1; the two durations accept 0.

## Returns

[`BatchLogRecordProcessorOptions`](../interfaces/BatchLogRecordProcessorOptions.md)

Batch log record processor options

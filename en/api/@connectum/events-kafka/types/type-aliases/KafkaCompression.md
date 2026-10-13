[Connectum API Reference](../../../../index.md) / [@connectum/events-kafka](../../index.md) / [types](../index.md) / KafkaCompression

# Type Alias: KafkaCompression

> **KafkaCompression** = `"none"` \| `"gzip"` \| `"snappy"` \| `"lz4"` \| `"zstd"`

Defined in: [types.ts:67](https://github.com/Connectum-Framework/connectum/blob/main/packages/events-kafka/src/types.ts#L67)

Compression of produced messages. Gzip works as shipped; Snappy, LZ4 and ZSTD need a codec that the
application registers with the client library before the first publish, otherwise publishing fails.

---
title: Kafka Adapter Options
description: From 1.3.0, @connectum/events-kafka no longer exposes Kafka client types; the kafkaConfig option is replaced by typed options and clientOptions.
docType: migration
---

# Kafka Adapter Options

> Applies to 1.3.0.

## Does this apply to you?

You need to act only if your code passes `kafkaConfig` to `KafkaAdapter()`, passes a numeric `producerOptions.compression` (for example `CompressionTypes.GZIP` or `1`), or imports types from `kafkajs` to describe the adapter's options. The examples and the guides of this documentation never used `kafkaConfig`; production setups that need TLS or SASL usually did.

## What changed

The published types of `@connectum/events-kafka` used to import `KafkaConfig` and `CompressionTypes` from the Kafka client library, so replacing the client would have broken this package's API even where the adapter's behaviour stays the same. The options are now types of this package.

| Before | From 1.3.0 |
|--------|------------|
| `kafkaConfig: { ssl, sasl, connectionTimeout, authenticationTimeout, reauthenticationThreshold, requestTimeout, enforceRequestTimeout, retry, logLevel }` | the same names as top-level options |
| `kafkaConfig: { logLevel: logLevel.ERROR }` | `logLevel: 'error'` (`nothing`, `error`, `warn`, `info`, `debug`) |
| `producerOptions: { compression: CompressionTypes.GZIP }` or `compression: 1` | `producerOptions: { compression: 'gzip' }` (`none`, `gzip`, `snappy`, `lz4`, `zstd`) |
| `kafkaConfig: { logCreator, socketFactory, a custom SASL mechanism, retry.restartOnFailure }` | `clientOptions: { ... }` |

`clientOptions` holds settings that have no portable form. Its keys are those of the client library the adapter uses today, they are not type-checked, and they may change if that library is replaced. It is merged shallowly over the typed options (a `retry` in `clientOptions` replaces the typed `retry`), and it can never override `brokers` or `clientId`.

Passing `kafkaConfig` now throws a `TypeError`, instead of being ignored, so that a service never connects without the TLS and SASL settings it asked for. A `compression` that is not one of the five names, a number included, throws a `RangeError`.

`snappy`, `lz4` and `zstd` still need a codec that your application registers with the client library before the first publish; only `gzip` works as shipped.

## Required changes

```typescript
// before
KafkaAdapter({
  brokers,
  kafkaConfig: {
    ssl: true,
    sasl: { mechanism: 'plain', username, password },
    logLevel: logLevel.WARN,
  },
  producerOptions: { compression: CompressionTypes.GZIP },
});

// after
KafkaAdapter({
  brokers,
  ssl: true,
  sasl: { mechanism: 'plain', username, password },
  logLevel: 'warn',
  producerOptions: { compression: 'gzip' },
});
```

Move anything the typed options do not cover into `clientOptions`.

## Verify

Start the service: the constructor throws if a removed key is still in use. Publish one message and consume it; with `logLevel: 'debug'` the client's own log shows the connection with the TLS and SASL settings you configured.

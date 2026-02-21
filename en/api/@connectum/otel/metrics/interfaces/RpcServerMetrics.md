[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [metrics](../index.md) / RpcServerMetrics

# Interface: RpcServerMetrics

Defined in: [packages/otel/src/metrics.ts:19](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/otel/src/metrics.ts#L19)

Pre-configured RPC server metric instruments

Contains histograms for call duration, request size, and response size
following OpenTelemetry RPC semantic conventions.

## Properties

### callDuration

> **callDuration**: `Histogram`

Defined in: [packages/otel/src/metrics.ts:21](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/otel/src/metrics.ts#L21)

Histogram measuring duration of RPC server calls (unit: seconds)

***

### requestSize

> **requestSize**: `Histogram`

Defined in: [packages/otel/src/metrics.ts:23](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/otel/src/metrics.ts#L23)

Histogram measuring size of RPC server request messages (unit: bytes)

***

### responseSize

> **responseSize**: `Histogram`

Defined in: [packages/otel/src/metrics.ts:25](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/otel/src/metrics.ts#L25)

Histogram measuring size of RPC server response messages (unit: bytes)

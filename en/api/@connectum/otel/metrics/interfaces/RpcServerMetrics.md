[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [metrics](../index.md) / RpcServerMetrics

# Interface: RpcServerMetrics

Defined in: [metrics.ts:29](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/metrics.ts#L29)

Pre-configured RPC server metric instruments

Contains histograms for call duration, request size, and response size
following OpenTelemetry RPC semantic conventions.

## Properties

### callDuration

> **callDuration**: `Histogram`

Defined in: [metrics.ts:31](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/metrics.ts#L31)

Histogram measuring duration of RPC server calls (unit: seconds)

***

### requestSize

> **requestSize**: `Histogram`

Defined in: [metrics.ts:33](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/metrics.ts#L33)

Histogram measuring size of RPC server request messages (unit: bytes)

***

### responseSize

> **responseSize**: `Histogram`

Defined in: [metrics.ts:35](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/metrics.ts#L35)

Histogram measuring size of RPC server response messages (unit: bytes)

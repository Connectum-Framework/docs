[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [metrics](../index.md) / RpcClientMetrics

# Interface: RpcClientMetrics

Defined in: [metrics.ts:44](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/metrics.ts#L44)

Pre-configured RPC client metric instruments

Contains histograms for call duration, request size, and response size
following OpenTelemetry RPC semantic conventions.

## Properties

### callDuration

> **callDuration**: `Histogram`

Defined in: [metrics.ts:46](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/metrics.ts#L46)

Histogram measuring duration of RPC client calls (unit: seconds)

***

### requestSize

> **requestSize**: `Histogram`

Defined in: [metrics.ts:48](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/metrics.ts#L48)

Histogram measuring size of RPC client request messages (unit: bytes)

***

### responseSize

> **responseSize**: `Histogram`

Defined in: [metrics.ts:50](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/metrics.ts#L50)

Histogram measuring size of RPC client response messages (unit: bytes)

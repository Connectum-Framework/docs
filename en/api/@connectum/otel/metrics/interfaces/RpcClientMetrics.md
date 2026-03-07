[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [metrics](../index.md) / RpcClientMetrics

# Interface: RpcClientMetrics

Defined in: [packages/otel/src/metrics.ts:34](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/otel/src/metrics.ts#L34)

Pre-configured RPC client metric instruments

Contains histograms for call duration, request size, and response size
following OpenTelemetry RPC semantic conventions.

## Properties

### callDuration

> **callDuration**: `Histogram`

Defined in: [packages/otel/src/metrics.ts:36](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/otel/src/metrics.ts#L36)

Histogram measuring duration of RPC client calls (unit: seconds)

***

### requestSize

> **requestSize**: `Histogram`

Defined in: [packages/otel/src/metrics.ts:38](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/otel/src/metrics.ts#L38)

Histogram measuring size of RPC client request messages (unit: bytes)

***

### responseSize

> **responseSize**: `Histogram`

Defined in: [packages/otel/src/metrics.ts:40](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/otel/src/metrics.ts#L40)

Histogram measuring size of RPC client response messages (unit: bytes)

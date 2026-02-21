[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [metrics](../index.md) / createRpcServerMetrics

# Function: createRpcServerMetrics()

> **createRpcServerMetrics**(`meter`): [`RpcServerMetrics`](../interfaces/RpcServerMetrics.md)

Defined in: [packages/otel/src/metrics.ts:65](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/otel/src/metrics.ts#L65)

Creates RPC server metric instruments from the given meter

All metrics follow OpenTelemetry semantic conventions for RPC:
- `rpc.server.call.duration` -- call duration in seconds
- `rpc.server.request.size` -- request message size in bytes
- `rpc.server.response.size` -- response message size in bytes

## Parameters

### meter

[`Meter`](../../interfaces/Meter.md)

OpenTelemetry Meter instance to create histograms from

## Returns

[`RpcServerMetrics`](../interfaces/RpcServerMetrics.md)

Object containing all RPC server metric instruments

## Example

```typescript
import { metrics } from '@opentelemetry/api';
import { createRpcServerMetrics } from '@connectum/otel';

const meter = metrics.getMeter('my-service');
const rpcMetrics = createRpcServerMetrics(meter);

rpcMetrics.callDuration.record(0.123, { 'rpc.method': 'GetUser' });
```

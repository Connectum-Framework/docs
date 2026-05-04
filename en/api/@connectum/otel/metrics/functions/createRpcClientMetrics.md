[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [metrics](../index.md) / createRpcClientMetrics

# Function: createRpcClientMetrics()

> **createRpcClientMetrics**(`meter`): [`RpcClientMetrics`](../interfaces/RpcClientMetrics.md)

Defined in: [packages/otel/src/metrics.ts:106](https://github.com/Connectum-Framework/connectum/blob/acbe73ae0e923dc7b46c1b4a6241f3e342535af7/packages/otel/src/metrics.ts#L106)

Creates RPC client metric instruments from the given meter

All metrics follow OpenTelemetry semantic conventions for RPC:
- `rpc.client.call.duration` -- call duration in seconds
- `rpc.client.request.size` -- request message size in bytes
- `rpc.client.response.size` -- response message size in bytes

## Parameters

### meter

[`Meter`](../../interfaces/Meter.md)

OpenTelemetry Meter instance to create histograms from

## Returns

[`RpcClientMetrics`](../interfaces/RpcClientMetrics.md)

Object containing all RPC client metric instruments

## Example

```typescript
import { metrics } from '@opentelemetry/api';
import { createRpcClientMetrics } from '@connectum/otel';

const meter = metrics.getMeter('my-client');
const rpcMetrics = createRpcClientMetrics(meter);

rpcMetrics.callDuration.record(0.045, { 'rpc.method': 'GetUser' });
```

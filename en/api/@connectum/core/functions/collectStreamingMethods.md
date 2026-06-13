[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / collectStreamingMethods

# Function: collectStreamingMethods()

> **collectStreamingMethods**(`registry`): [`StreamingMethodInfo`](../interfaces/StreamingMethodInfo.md)[]

Defined in: [packages/core/src/TransportValidation.ts:106](https://github.com/Connectum-Framework/connectum/blob/caf5b110b00f27241af3e0656091ebf408eea7a0/packages/core/src/TransportValidation.ts#L106)

Collect bidi-streaming methods from a DescFile registry (built during
route registration). Client-streaming is NOT collected — the Connect
protocol supports it over HTTP/1.1.

## Parameters

### registry

readonly `DescFile`[]

## Returns

[`StreamingMethodInfo`](../interfaces/StreamingMethodInfo.md)[]

[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / collectStreamingMethods

# Function: collectStreamingMethods()

> **collectStreamingMethods**(`registry`): [`StreamingMethodInfo`](../interfaces/StreamingMethodInfo.md)[]

Defined in: [packages/core/src/TransportValidation.ts:106](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/TransportValidation.ts#L106)

Collect bidi-streaming methods from a DescFile registry (built during
route registration). Client-streaming is NOT collected — the Connect
protocol supports it over HTTP/1.1.

## Parameters

### registry

readonly `DescFile`[]

## Returns

[`StreamingMethodInfo`](../interfaces/StreamingMethodInfo.md)[]

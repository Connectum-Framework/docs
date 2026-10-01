[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / collectStreamingMethods

# Function: collectStreamingMethods()

> **collectStreamingMethods**(`source`): [`StreamingMethodInfo`](../interfaces/StreamingMethodInfo.md)[]

Defined in: [packages/core/src/TransportValidation.ts:110](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/TransportValidation.ts#L110)

Collect bidi-streaming methods. Client-streaming is NOT collected — the
Connect protocol supports it over HTTP/1.1.

Pass the mounted services (`DescService`) to check what a server actually
serves; that is what `Server.start()` does. A file (`DescFile`) contributes
every service it declares, including services that are not mounted, so a
file-based check can report methods nobody can call.

## Parameters

### source

readonly ([`DescService`](https://protobufes.com/reference/reflection/descriptors/#types) \| `DescFile`)[]

## Returns

[`StreamingMethodInfo`](../interfaces/StreamingMethodInfo.md)[]

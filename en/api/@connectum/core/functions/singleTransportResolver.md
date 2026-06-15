[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / singleTransportResolver

# Function: singleTransportResolver()

> **singleTransportResolver**(`transport`): [`RemoteResolver`](../type-aliases/RemoteResolver.md)

Defined in: [packages/core/src/remoteResolver.ts:46](https://github.com/Connectum-Framework/connectum/blob/19a3629e21bbbb6bb1914ecc539b8c29d9ab24c5/packages/core/src/remoteResolver.ts#L46)

A resolver that routes every remote service to the same `Transport`. Useful
for a single upstream (sidecar, gateway) that fronts all remote services.

## Parameters

### transport

`Transport`

## Returns

[`RemoteResolver`](../type-aliases/RemoteResolver.md)

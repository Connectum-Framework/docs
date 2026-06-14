[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / singleTransportResolver

# Function: singleTransportResolver()

> **singleTransportResolver**(`transport`): [`RemoteResolver`](../type-aliases/RemoteResolver.md)

Defined in: [packages/core/src/remoteResolver.ts:46](https://github.com/Connectum-Framework/connectum/blob/463fc8d9fdd1405669507455906d7d32df3a12d9/packages/core/src/remoteResolver.ts#L46)

A resolver that routes every remote service to the same `Transport`. Useful
for a single upstream (sidecar, gateway) that fronts all remote services.

## Parameters

### transport

`Transport`

## Returns

[`RemoteResolver`](../type-aliases/RemoteResolver.md)

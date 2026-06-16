[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / singleTransportResolver

# Function: singleTransportResolver()

> **singleTransportResolver**(`transport`): [`RemoteResolver`](../type-aliases/RemoteResolver.md)

Defined in: [packages/core/src/remoteResolver.ts:46](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/core/src/remoteResolver.ts#L46)

A resolver that routes every remote service to the same `Transport`. Useful
for a single upstream (sidecar, gateway) that fronts all remote services.

## Parameters

### transport

`Transport`

## Returns

[`RemoteResolver`](../type-aliases/RemoteResolver.md)

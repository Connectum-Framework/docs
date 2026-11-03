[Connectum API Reference](../../../index.md) / [@connectum/reflection](../index.md) / Reflection

# Function: Reflection()

> **Reflection**(): `ProtocolRegistration`

Defined in: [Reflection.ts:64](https://github.com/Connectum-Framework/connectum/blob/main/packages/reflection/src/Reflection.ts#L64)

Create reflection protocol registration

Returns a ProtocolRegistration that implements gRPC Server Reflection
Protocol (v1 + v1alpha). Pass it to createServer({ protocols: [...] }).

The listing contains every service the server mounts: the application
services and the services of all other protocols, wherever `Reflection()`
stands in the `protocols` array. The descriptors are collected in the
protocol's `ready` hook, after every protocol has registered. The reflection
services themselves are not listed, but their schema can be requested like
any other: `file_containing_symbol` for `grpc.reflection.v1.ServerReflection`
(or its `v1alpha` twin, a method or a message of it) answers with
`grpc/reflection/v1/reflection.proto`. File answers carry the requested file
and its transitive imports, without repeating files already sent on the same
stream.

The returned registration holds the descriptors of the server it was
set up for, so each server needs its own `Reflection()` call: a shared
instance would list the services of whichever server ran `ready` last.

A protocol that wraps `Reflection()` and delegates to it must forward
`ready` as well as `setup` and `register`. Without `ready` the listing falls
back to the services registered before the wrapper, as it did before the
hook existed.

## Returns

`ProtocolRegistration`

ProtocolRegistration for server reflection

## Example

```typescript
import { createServer } from '@connectum/core';
import { Reflection } from '@connectum/reflection';

const server = createServer({
  services: [myRoutes],
  protocols: [Reflection()],
});

await server.start();
// Now clients can discover services via gRPC reflection
```

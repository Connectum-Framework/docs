[Connectum API Reference](../../../index.md) / [@connectum/reflection](../index.md) / Reflection

# Function: Reflection()

> **Reflection**(): `ProtocolRegistration`

Defined in: [Reflection.ts:50](https://github.com/Connectum-Framework/connectum/blob/main/packages/reflection/src/Reflection.ts#L50)

Create reflection protocol registration

Returns a ProtocolRegistration that implements gRPC Server Reflection
Protocol (v1 + v1alpha). Pass it to createServer({ protocols: [...] }).

The listing contains the services mounted before this protocol: every
application service and the protocols that precede `Reflection()` in the
`protocols` array. File answers carry the requested file and its transitive
imports, without repeating files already sent on the same stream.

The returned registration holds the descriptors of the server it was
set up for, so each server needs its own `Reflection()` call: a shared
instance would list the services of whichever server ran `setup` last.

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

[Connectum API Reference](../../../index.md) / [@connectum/reflection](../index.md) / Reflection

# Function: Reflection()

> **Reflection**(): `ProtocolRegistration`

Defined in: [Reflection.ts:47](https://github.com/Connectum-Framework/connectum/blob/main/packages/reflection/src/Reflection.ts#L47)

Create reflection protocol registration

Returns a ProtocolRegistration that implements gRPC Server Reflection
Protocol (v1 + v1alpha). Pass it to createServer({ protocols: [...] }).

The returned registration holds the descriptor set of the server it was
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

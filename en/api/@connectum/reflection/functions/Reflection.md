[Connectum API Reference](../../../index.md) / [@connectum/reflection](../index.md) / Reflection

# Function: Reflection()

> **Reflection**(): `ProtocolRegistration`

Defined in: [Reflection.ts:43](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/reflection/src/Reflection.ts#L43)

Create reflection protocol registration

Returns a ProtocolRegistration that implements gRPC Server Reflection
Protocol (v1 + v1alpha). Pass it to createServer({ protocols: [...] }).

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

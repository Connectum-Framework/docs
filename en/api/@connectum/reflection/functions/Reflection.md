[Connectum API Reference](../../../index.md) / [@connectum/reflection](../index.md) / Reflection

# Function: Reflection()

> **Reflection**(): `ProtocolRegistration`

Defined in: [Reflection.ts:42](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/reflection/src/Reflection.ts#L42)

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

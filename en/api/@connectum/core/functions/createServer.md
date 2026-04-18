[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / createServer

# Function: createServer()

> **createServer**(`options`): [`Server`](../types/interfaces/Server.md)

Defined in: [packages/core/src/Server.ts:297](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/core/src/Server.ts#L297)

Create a new server instance

Returns an unstarted server. Call server.start() to begin accepting connections.

## Parameters

### options

[`CreateServerOptions`](../types/interfaces/CreateServerOptions.md)

Server configuration options

## Returns

[`Server`](../types/interfaces/Server.md)

Unstarted server instance

## Example

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';

const server = createServer({
  services: [myRoutes],
  protocols: [Healthcheck({ httpEnabled: true }), Reflection()],
  shutdown: { autoShutdown: true },
});

server.on('ready', () => {
  healthcheckManager.update(ServingStatus.SERVING);
});

await server.start();
```

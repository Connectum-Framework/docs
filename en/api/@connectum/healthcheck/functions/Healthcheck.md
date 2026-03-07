[Connectum API Reference](../../../index.md) / [@connectum/healthcheck](../index.md) / Healthcheck

# Function: Healthcheck()

> **Healthcheck**(`options?`): `ProtocolRegistration`

Defined in: [Healthcheck.ts:84](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/healthcheck/src/Healthcheck.ts#L84)

Create healthcheck protocol registration

Returns a ProtocolRegistration directly (not `{ protocol, manager }`).
Pass to createServer({ protocols: [...] }).
Use the singleton `healthcheckManager` export to control health status.

## Parameters

### options?

[`HealthcheckOptions`](../types/interfaces/HealthcheckOptions.md) = `{}`

Healthcheck configuration options

## Returns

`ProtocolRegistration`

ProtocolRegistration for createServer

## Example

```typescript
import { createServer } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';

const server = createServer({
  services: [myRoutes],
  protocols: [Healthcheck({ httpEnabled: true })],
});

server.on('ready', () => {
  healthcheckManager.update(ServingStatus.SERVING);
});

await server.start();
```

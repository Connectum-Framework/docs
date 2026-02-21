[Connectum API Reference](../../../index.md) / [@connectum/healthcheck](../index.md) / Healthcheck

# Function: Healthcheck()

> **Healthcheck**(`options?`): `ProtocolRegistration`

Defined in: [Healthcheck.ts:83](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/healthcheck/src/Healthcheck.ts#L83)

Create healthcheck protocol registration

Returns a ProtocolRegistration directly (not `{ protocol, manager }`).
Pass to createServer({ protocols: [...] }).
Use the singleton `healthcheckManager` export to control health status.

## Parameters

### options?

[`HealthcheckOptions`](../interfaces/HealthcheckOptions.md) = `{}`

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

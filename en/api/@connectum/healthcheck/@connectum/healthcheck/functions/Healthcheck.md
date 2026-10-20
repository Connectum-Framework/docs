[Connectum API Reference](../../../../../index.md) / [@connectum/healthcheck](../../../index.md) / [@connectum/healthcheck](../index.md) / Healthcheck

# Function: Healthcheck()

> **Healthcheck**(`options?`): `ProtocolRegistration`

Defined in: [Healthcheck.ts:120](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/Healthcheck.ts#L120)

Create healthcheck protocol registration

Returns a ProtocolRegistration directly (not `{ protocol, manager }`).
Pass to createServer({ protocols: [...] }).
Use the singleton `healthcheckManager` export to control health status.

`httpPaths`, when passed, is validated even if `httpEnabled` is false.
HTTP request paths are matched exactly and case-sensitively (`/healthz/`
does not match `/healthz`); the query string is ignored and the method is
not checked.

## Parameters

### options?

[`HealthcheckOptions`](../types/interfaces/HealthcheckOptions.md) = `{}`

Healthcheck configuration options

## Returns

`ProtocolRegistration`

ProtocolRegistration for createServer

## Throws

when `httpPaths` is an empty array

## Throws

when `httpPaths` is not an array, or an entry is not a
  string, does not start with `/`, or contains `?` or `#`

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

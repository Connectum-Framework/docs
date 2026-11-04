[Connectum API Reference](../../../../../index.md) / [@connectum/healthcheck](../../../index.md) / [@connectum/healthcheck](../index.md) / Healthcheck

# Function: Healthcheck()

> **Healthcheck**(`options?`): `ProtocolRegistration`

Defined in: [Healthcheck.ts:126](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/Healthcheck.ts#L126)

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

when `httpPaths` is an empty array, or `watchInterval`
  is a number that is not an integer from 1 to 2147483647

## Throws

when `options` is not an object (`null` included),
  `manager` is not a HealthcheckManager, `httpEnabled` is not a boolean,
  `httpPaths` is not an array, or an entry is not a string, does not start
  with `/`, or contains `?` or `#`; or when `watchInterval` is not a number
  (including `null`)

A second `Healthcheck()` in one server (or an application service that
already is `grpc.health.v1.Health`) cannot be seen from here. It is refused
with an `Error` when the server builds its routes: `start()` rejects, and so
does the first call made through `localClient()` (the client itself is
created without building routes).

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

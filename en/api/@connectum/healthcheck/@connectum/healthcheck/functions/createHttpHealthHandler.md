[Connectum API Reference](../../../../../index.md) / [@connectum/healthcheck](../../../index.md) / [@connectum/healthcheck](../index.md) / createHttpHealthHandler

# Function: createHttpHealthHandler()

> **createHttpHealthHandler**(`manager`, `healthPaths?`): `HttpHandler`

Defined in: [httpHandler.ts:60](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/httpHandler.ts#L60)

Create an HTTP handler that reports the health manager's current status.

Configured paths return JSON with the service name, status, and timestamp.
A `service` query parameter checks one service or component; without it,
the handler reports overall health. Unknown named services return 404,
unhealthy overall status returns 503, and unconfigured paths are not handled.

## Parameters

### manager

[`HealthcheckManager`](../classes/HealthcheckManager.md)

Healthcheck manager instance

### healthPaths?

`string`[] = `DEFAULT_HTTP_PATHS`

HTTP health endpoint paths

## Returns

`HttpHandler`

HTTP handler function that returns true if request was handled

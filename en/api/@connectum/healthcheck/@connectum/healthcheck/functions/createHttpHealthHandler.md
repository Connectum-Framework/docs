[Connectum API Reference](../../../../../index.md) / [@connectum/healthcheck](../../../index.md) / [@connectum/healthcheck](../index.md) / createHttpHealthHandler

# Function: createHttpHealthHandler()

> **createHttpHealthHandler**(`manager`, `healthPaths?`): `HttpHandler`

Defined in: [httpHandler.ts:66](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/httpHandler.ts#L66)

Create an HTTP handler that reports the health manager's current status.

Configured paths return JSON with the service name, status, and timestamp.
A `service` query parameter checks one service or component; without it,
the handler reports overall health (an empty `service=` counts as absent).
Unknown named services return 404 with the requested name in the body,
unhealthy overall status returns 503, and unconfigured paths are not handled.

Matching rules: the request path is compared with the configured paths by
exact, case-sensitive equality without normalization (`/healthz/` does not
match `/healthz`); the query string is ignored when matching; the request
method is not checked; the `Host` header is not consulted.

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

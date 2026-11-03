[Connectum API Reference](../../../../../index.md) / [@connectum/healthcheck](../../../index.md) / [@connectum/healthcheck](../index.md) / createHttpHealthHandler

# Function: createHttpHealthHandler()

> **createHttpHealthHandler**(`manager`, `healthPaths?`): `HttpHandler`

Defined in: [httpHandler.ts:74](https://github.com/Connectum-Framework/connectum/blob/main/packages/healthcheck/src/httpHandler.ts#L74)

Create an HTTP handler that reports the health manager's current status.

Configured paths return JSON with the service name, status, and timestamp.
A `service` query parameter checks one service or component; without it,
the handler reports overall health (an empty `service=` counts as absent:
same status, same HTTP code, and `"service": "overall"` in the body).
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

HTTP health endpoint paths: a non-empty array of
  absolute paths, each starting with `/` and free of `?` and `#`. Defaults to
  `/healthz`, `/health` and `/readyz` when omitted.

## Returns

`HttpHandler`

HTTP handler function that returns true if request was handled

## Throws

when `healthPaths` is an empty array (a handler that can
  never match a request)

## Throws

when `healthPaths` is not an array, or an entry is not a
  string, does not start with `/`, or contains `?` or `#`

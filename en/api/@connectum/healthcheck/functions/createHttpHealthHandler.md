[Connectum API Reference](../../../index.md) / [@connectum/healthcheck](../index.md) / createHttpHealthHandler

# Function: createHttpHealthHandler()

> **createHttpHealthHandler**(`manager`, `healthPaths?`): `HttpHandler`

Defined in: [httpHandler.ts:57](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/healthcheck/src/httpHandler.ts#L57)

Create HTTP health handler that mirrors gRPC healthcheck status

Returns an HttpHandler compatible with the ProtocolRegistration interface.

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

[Connectum API Reference](../../../index.md) / [@connectum/healthcheck](../index.md) / createHttpHealthHandler

# Function: createHttpHealthHandler()

> **createHttpHealthHandler**(`manager`, `healthPaths?`): `HttpHandler`

Defined in: [httpHandler.ts:58](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/healthcheck/src/httpHandler.ts#L58)

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

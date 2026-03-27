[Connectum API Reference](../../../../../index.md) / [@connectum/healthcheck](../../../index.md) / [@connectum/healthcheck](../index.md) / createHttpHealthHandler

# Function: createHttpHealthHandler()

> **createHttpHealthHandler**(`manager`, `healthPaths?`): `HttpHandler`

Defined in: [httpHandler.ts:58](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/healthcheck/src/httpHandler.ts#L58)

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

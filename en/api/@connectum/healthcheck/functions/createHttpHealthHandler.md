[Connectum API Reference](../../../index.md) / [@connectum/healthcheck](../index.md) / createHttpHealthHandler

# Function: createHttpHealthHandler()

> **createHttpHealthHandler**(`manager`, `healthPaths?`): `HttpHandler`

Defined in: [httpHandler.ts:57](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/healthcheck/src/httpHandler.ts#L57)

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

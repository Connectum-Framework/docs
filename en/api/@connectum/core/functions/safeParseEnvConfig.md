[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / safeParseEnvConfig

# Function: safeParseEnvConfig()

> **safeParseEnvConfig**(`env?`): `ZodSafeParseResult`\<\{ `GRACEFUL_SHUTDOWN_ENABLED`: `boolean`; `GRACEFUL_SHUTDOWN_TIMEOUT_MS`: `number`; `HTTP_HEALTH_ENABLED`: `boolean`; `HTTP_HEALTH_PATH`: `string`; `LISTEN`: `string`; `LOG_BACKEND`: `"otel"` \| `"pino"` \| `"console"`; `LOG_FORMAT`: `"json"` \| `"pretty"`; `LOG_LEVEL`: `"error"` \| `"debug"` \| `"info"` \| `"warn"`; `NODE_ENV`: `"test"` \| `"production"` \| `"development"`; `OTEL_EXPORTER_OTLP_ENDPOINT?`: `string`; `OTEL_SERVICE_NAME?`: `string`; `PORT`: `number`; \}\>

Defined in: [packages/core/src/config/envSchema.ts:162](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/core/src/config/envSchema.ts#L162)

Safely parse environment configuration (returns result object)

## Parameters

### env?

`Record`\<`string`, `string` \| `undefined`\> = `process.env`

## Returns

`ZodSafeParseResult`\<\{ `GRACEFUL_SHUTDOWN_ENABLED`: `boolean`; `GRACEFUL_SHUTDOWN_TIMEOUT_MS`: `number`; `HTTP_HEALTH_ENABLED`: `boolean`; `HTTP_HEALTH_PATH`: `string`; `LISTEN`: `string`; `LOG_BACKEND`: `"otel"` \| `"pino"` \| `"console"`; `LOG_FORMAT`: `"json"` \| `"pretty"`; `LOG_LEVEL`: `"error"` \| `"debug"` \| `"info"` \| `"warn"`; `NODE_ENV`: `"test"` \| `"production"` \| `"development"`; `OTEL_EXPORTER_OTLP_ENDPOINT?`: `string`; `OTEL_SERVICE_NAME?`: `string`; `PORT`: `number`; \}\>

## Example

```typescript
const result = safeParseEnvConfig();
if (result.success) {
  console.log(result.data.PORT);
} else {
  console.error(result.error.format());
}
```

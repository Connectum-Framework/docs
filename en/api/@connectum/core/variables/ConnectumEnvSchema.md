[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ConnectumEnvSchema

# Variable: ConnectumEnvSchema

> `const` **ConnectumEnvSchema**: `ZodObject`\<\{ `GRACEFUL_SHUTDOWN_ENABLED`: `ZodPipe`\<`ZodDefault`\<`ZodEnum`\<\{ `0`: `"0"`; `1`: `"1"`; `false`: `"false"`; `no`: `"no"`; `true`: `"true"`; `yes`: `"yes"`; \}\>\>, `ZodTransform`\<`boolean`, `"0"` \| `"1"` \| `"true"` \| `"false"` \| `"yes"` \| `"no"`\>\>; `GRACEFUL_SHUTDOWN_TIMEOUT_MS`: `ZodDefault`\<`ZodCoercedNumber`\<`unknown`\>\>; `HTTP_HEALTH_ENABLED`: `ZodPipe`\<`ZodDefault`\<`ZodEnum`\<\{ `0`: `"0"`; `1`: `"1"`; `false`: `"false"`; `no`: `"no"`; `true`: `"true"`; `yes`: `"yes"`; \}\>\>, `ZodTransform`\<`boolean`, `"0"` \| `"1"` \| `"true"` \| `"false"` \| `"yes"` \| `"no"`\>\>; `HTTP_HEALTH_PATH`: `ZodDefault`\<`ZodString`\>; `LISTEN`: `ZodDefault`\<`ZodString`\>; `LOG_BACKEND`: `ZodDefault`\<`ZodEnum`\<\{ `console`: `"console"`; `otel`: `"otel"`; `pino`: `"pino"`; \}\>\>; `LOG_FORMAT`: `ZodDefault`\<`ZodEnum`\<\{ `json`: `"json"`; `pretty`: `"pretty"`; \}\>\>; `LOG_LEVEL`: `ZodDefault`\<`ZodEnum`\<\{ `debug`: `"debug"`; `error`: `"error"`; `info`: `"info"`; `warn`: `"warn"`; \}\>\>; `NODE_ENV`: `ZodDefault`\<`ZodEnum`\<\{ `development`: `"development"`; `production`: `"production"`; `test`: `"test"`; \}\>\>; `OTEL_EXPORTER_OTLP_ENDPOINT`: `ZodOptional`\<`ZodString`\>; `OTEL_SERVICE_NAME`: `ZodOptional`\<`ZodString`\>; `PORT`: `ZodDefault`\<`ZodCoercedNumber`\<`unknown`\>\>; \}, `$strip`\>

Defined in: [packages/core/src/config/envSchema.ts:53](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/core/src/config/envSchema.ts#L53)

Connectum environment configuration schema

All environment variables with their defaults and validation.
Based on 12-Factor App configuration principles.

## Example

```typescript
const config = ConnectumEnvSchema.parse(process.env);
console.log(config.PORT); // 5000 (default)
console.log(config.LOG_LEVEL); // 'info' (default)
```

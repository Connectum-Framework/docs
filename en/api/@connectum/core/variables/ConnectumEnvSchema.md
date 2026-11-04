[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / ConnectumEnvSchema

# Variable: ConnectumEnvSchema

> `const` **ConnectumEnvSchema**: `ZodObject`\<\{ `GRACEFUL_SHUTDOWN_ENABLED`: `ZodPipe`\<`ZodDefault`\<`ZodEnum`\<\{ `0`: `"0"`; `1`: `"1"`; `false`: `"false"`; `no`: `"no"`; `true`: `"true"`; `yes`: `"yes"`; \}\>\>, `ZodTransform`\<`boolean`, `"0"` \| `"1"` \| `"true"` \| `"yes"` \| `"false"` \| `"no"`\>\>; `GRACEFUL_SHUTDOWN_TIMEOUT_MS`: `ZodPreprocess`\<`ZodDefault`\<`ZodCoercedNumber`\<`unknown`\>\>, `unknown`\>; `HTTP_HEALTH_ENABLED`: `ZodPipe`\<`ZodDefault`\<`ZodEnum`\<\{ `0`: `"0"`; `1`: `"1"`; `false`: `"false"`; `no`: `"no"`; `true`: `"true"`; `yes`: `"yes"`; \}\>\>, `ZodTransform`\<`boolean`, `"0"` \| `"1"` \| `"true"` \| `"yes"` \| `"false"` \| `"no"`\>\>; `HTTP_HEALTH_PATH`: `ZodDefault`\<`ZodString`\>; `LISTEN`: `ZodDefault`\<`ZodString`\>; `LOG_BACKEND`: `ZodDefault`\<`ZodEnum`\<\{ `console`: `"console"`; `otel`: `"otel"`; `pino`: `"pino"`; \}\>\>; `LOG_FORMAT`: `ZodDefault`\<`ZodEnum`\<\{ `json`: `"json"`; `pretty`: `"pretty"`; \}\>\>; `LOG_LEVEL`: `ZodDefault`\<`ZodEnum`\<\{ `debug`: `"debug"`; `error`: `"error"`; `info`: `"info"`; `warn`: `"warn"`; \}\>\>; `NODE_ENV`: `ZodDefault`\<`ZodEnum`\<\{ `development`: `"development"`; `production`: `"production"`; `test`: `"test"`; \}\>\>; `OTEL_EXPORTER_OTLP_ENDPOINT`: `ZodPreprocess`\<`ZodOptional`\<`ZodURL`\>, `unknown`\>; `OTEL_SERVICE_NAME`: `ZodPreprocess`\<`ZodOptional`\<`ZodString`\>, `unknown`\>; `PORT`: `ZodDefault`\<`ZodPipe`\<`ZodPipe`\<`ZodString`, `ZodTransform`\<`number`, `string`\>\>, `ZodNumber`\>\>; \}, `$strip`\>

Defined in: [packages/core/src/config/envSchema.ts:60](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/config/envSchema.ts#L60)

Connectum environment configuration schema

All environment variables with their defaults and validation.
Based on 12-Factor App configuration principles.

## Example

```typescript
const config = ConnectumEnvSchema.parse(process.env);
console.log(config.PORT); // 5000 (default)
console.log(config.LOG_LEVEL); // 'info' (default)
```

[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / parseEnvConfig

# Function: parseEnvConfig()

> **parseEnvConfig**(`env?`): `object`

Defined in: [packages/core/src/config/envSchema.ts:145](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/core/src/config/envSchema.ts#L145)

Parse and validate environment configuration

## Parameters

### env?

`Record`\<`string`, `string` \| `undefined`\> = `process.env`

## Returns

### GRACEFUL\_SHUTDOWN\_ENABLED

> **GRACEFUL\_SHUTDOWN\_ENABLED**: `boolean`

Enable graceful shutdown

#### Default

```ts
true
```

### GRACEFUL\_SHUTDOWN\_TIMEOUT\_MS

> **GRACEFUL\_SHUTDOWN\_TIMEOUT\_MS**: `number`

Graceful shutdown timeout in milliseconds

#### Default

```ts
30000
```

### HTTP\_HEALTH\_ENABLED

> **HTTP\_HEALTH\_ENABLED**: `boolean` = `BooleanFromStringSchema`

Enable HTTP health endpoints (/healthz, /readyz)
When disabled, only gRPC healthcheck is available

#### Default

```ts
false
```

### HTTP\_HEALTH\_PATH

> **HTTP\_HEALTH\_PATH**: `string`

HTTP health endpoint path

#### Default

```ts
'/healthz'
```

### LISTEN

> **LISTEN**: `string`

Listen address

#### Default

```ts
'0.0.0.0'
```

### LOG\_BACKEND

> **LOG\_BACKEND**: `"otel"` \| `"pino"` \| `"console"` = `LoggerBackendSchema`

Logger backend

#### Default

```ts
'otel'
```

### LOG\_FORMAT

> **LOG\_FORMAT**: `"json"` \| `"pretty"` = `LogFormatSchema`

Log format (json for production, pretty for development)

#### Default

```ts
'json'
```

### LOG\_LEVEL

> **LOG\_LEVEL**: `"error"` \| `"debug"` \| `"info"` \| `"warn"` = `LogLevelSchema`

Log level

#### Default

```ts
'info'
```

### NODE\_ENV

> **NODE\_ENV**: `"test"` \| `"production"` \| `"development"` = `NodeEnvSchema`

Node environment

#### Default

```ts
'development'
```

### OTEL\_EXPORTER\_OTLP\_ENDPOINT?

> `optional` **OTEL\_EXPORTER\_OTLP\_ENDPOINT**: `string`

OpenTelemetry exporter endpoint

### OTEL\_SERVICE\_NAME?

> `optional` **OTEL\_SERVICE\_NAME**: `string`

OpenTelemetry service name

#### Default

```ts
'connectum-service'
```

### PORT

> **PORT**: `number`

Server port

#### Default

```ts
5000
```

## Example

```typescript
const config = parseEnvConfig();
// or with custom env
const config = parseEnvConfig({ PORT: '8080' });
```

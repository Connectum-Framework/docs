[Connectum API Reference](../../../index.md) / [@connectum/core](../index.md) / parseEnvConfig

# Function: parseEnvConfig()

> **parseEnvConfig**(`env?`): `object`

Defined in: [packages/core/src/config/envSchema.ts:168](https://github.com/Connectum-Framework/connectum/blob/main/packages/core/src/config/envSchema.ts#L168)

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

Graceful shutdown timeout in milliseconds: a whole number from 0 to
300000, the same kind of value `createServer({ shutdown: { timeout } })`
accepts (a fraction is rejected here, naming this variable, instead of at
server creation). A blank value is rejected rather than read as 0.

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

> **LOG\_BACKEND**: `"console"` \| `"otel"` \| `"pino"` = `LoggerBackendSchema`

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

> **LOG\_LEVEL**: `"error"` \| `"warn"` \| `"info"` \| `"debug"` = `LogLevelSchema`

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

> `optional` **OTEL\_EXPORTER\_OTLP\_ENDPOINT?**: `string`

OpenTelemetry exporter endpoint: an absolute `http:` or `https:` URL. A bare
`host:port` such as `localhost:4318` parses as a URL with the scheme
`localhost:`, so the scheme is checked explicitly. An empty value is read as unset.

### OTEL\_SERVICE\_NAME?

> `optional` **OTEL\_SERVICE\_NAME?**: `string`

Optional OpenTelemetry service name. The core parser leaves it undefined
when absent or empty (the OpenTelemetry SDK reads an empty value of an
environment variable as unset); provider defaults belong to the telemetry
package.

### PORT

> **PORT**: `number`

Server port: a whole number from 1 to 65535 written in decimal digits. A
fraction, or a form `Number()` would read (`0x50`, `1e3`, `+80`, padded with
spaces), is rejected here instead of being read as another port or failing
later inside the network layer.

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

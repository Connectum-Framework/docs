---
title: Environment Configuration
description: Configure and validate Connectum server environment variables, defaults, and TLS paths.
docType: reference
outline: deep
---

# Environment Configuration

Connectum provides environment validation using [Zod](https://zod.dev/) schemas.
`parseEnvConfig()` returns configuration values; wire them explicitly into the
server and modules. `PORT` and `LISTEN` are also read directly when the corresponding
server options are omitted. The remaining schema fields do not configure modules
merely by being present in the environment.

## ConnectumEnvSchema

The `ConnectumEnvSchema` exported from `@connectum/core` defines all recognized environment variables:

```typescript
import { parseEnvConfig } from '@connectum/core';

const config = parseEnvConfig();

console.log(config.PORT);           // 5000 (default)
console.log(config.LISTEN);         // "0.0.0.0" (default)
console.log(config.LOG_LEVEL);      // "info" (default)
console.log(config.NODE_ENV);       // "development" (default)
```

## Environment Variables Reference

### Server

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `PORT` | `number` | `5000` | Server port, a whole number from 1 to 65535 written in decimal digits. A fractional value such as `80.5`, or a notation `Number()` would read (`0x50`, `1e3`, `+80`, spaces around the digits), is rejected with an error on `PORT`; leading zeros stay decimal (`08080` is `8080`) |
| `LISTEN` | `string` | `"0.0.0.0"` | Listen address |
| `NODE_ENV` | `enum` | `"development"` | `"development"`, `"production"`, or `"test"` |

### Logging

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `LOG_LEVEL` | `enum` | `"info"` | `"debug"`, `"info"`, `"warn"`, or `"error"` |
| `LOG_FORMAT` | `enum` | `"json"` | `"json"` (structured) or `"pretty"` (human-readable) |
| `LOG_BACKEND` | `enum` | `"otel"` | `"otel"`, `"pino"`, or `"console"` |

### Health Check

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `HTTP_HEALTH_ENABLED` | `boolean` | `false` | Enable HTTP health endpoints (`/healthz`, `/health`, `/readyz`) |
| `HTTP_HEALTH_PATH` | `string` | `"/healthz"` | Primary HTTP health endpoint path |

### OpenTelemetry

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `OTEL_SERVICE_NAME` | `string` | -- | Service name reported to the collector. An empty value is read as unset, as the OpenTelemetry SDK reads its own variables |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | `string (url)` | -- | OTLP collector endpoint, an absolute `http:` or `https:` URL (e.g. `http://localhost:4318`); `localhost:4318` and `ftp://collector` are rejected with an error on the variable; an empty value is read as unset |

### Graceful Shutdown

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `GRACEFUL_SHUTDOWN_ENABLED` | `boolean` | `true` | Enable automatic graceful shutdown on SIGTERM/SIGINT |
| `GRACEFUL_SHUTDOWN_TIMEOUT_MS` | `number` | `30000` | Maximum time (ms) to wait for in-flight requests (0--300000) |

::: tip
Boolean environment variables accept `"true"`, `"false"`, `"1"`, `"0"`, `"yes"`, and `"no"`.
:::

## Parsing and Validation

### parseEnvConfig()

Parses `process.env` (or a custom object) and throws a `ZodError` if validation fails:

```typescript
import { parseEnvConfig } from '@connectum/core';

try {
  const config = parseEnvConfig();
  console.log(`Starting on port ${config.PORT}`);
} catch (err) {
  console.error('Invalid configuration:', err instanceof Error ? err.message : err);
  process.exit(1);
}
```

### safeParseEnvConfig()

Returns a Zod result object instead of throwing:

```typescript
import { safeParseEnvConfig } from '@connectum/core';

const result = safeParseEnvConfig();

if (result.success) {
  console.log(`Port: ${result.data.PORT}`);
} else {
  console.error('Validation errors:');
  console.error(result.error.format());
  process.exit(1);
}
```

### Custom Environment Source

Both functions accept an optional env object, useful for testing:

```typescript
const config = parseEnvConfig({
  PORT: '8080',
  NODE_ENV: 'production',
  LOG_LEVEL: 'warn',
});
```

## Using Config with createServer()

Wire the parsed values explicitly. The schema enables graceful shutdown by
default, while `createServer()` leaves `autoShutdown` disabled unless you set it:

```typescript
import { createServer, parseEnvConfig } from '@connectum/core';
import { Healthcheck, healthcheckManager, ServingStatus } from '@connectum/healthcheck';
import { Reflection } from '@connectum/reflection';
import { greeterService } from './services/greeterService.ts';

const env = parseEnvConfig();

const server = createServer({
  services: [greeterService],
  port: env.PORT,
  host: env.LISTEN,
  protocols: [
    Healthcheck({
      httpEnabled: env.HTTP_HEALTH_ENABLED,
      httpPaths: [env.HTTP_HEALTH_PATH, '/health', '/readyz'],
    }),
    Reflection(),
  ],
  shutdown: {
    autoShutdown: env.GRACEFUL_SHUTDOWN_ENABLED,
    timeout: env.GRACEFUL_SHUTDOWN_TIMEOUT_MS,
  },
});

server.on('ready', () => {
  healthcheckManager.update(ServingStatus.SERVING);
});

await server.start();
```

Options passed to `createServer()` directly get the same fail-fast check as the variables. `port` must be an integer from `0` (a free port chosen by the system) to `65535`, and `host` a non-empty string; any other value, a numeric string such as `"5000"` included, throws a `TypeError` or `RangeError` that names the option. Before this check, a non-numeric string `port` was read as a Unix socket path and an empty `host` bound every interface.

## TLS Configuration

TLS is configured via the `tls` option in `createServer()`. Certificates can be loaded from explicit paths or a directory:

```typescript
import { createServer } from '@connectum/core';

// Option A: Explicit paths
const serverWithPaths = createServer({
  services: [routes],
  tls: {
    keyPath: '/etc/ssl/server.key',
    certPath: '/etc/ssl/server.crt',
  },
});

// Option B: Directory (looks for server.key and server.crt)
const serverWithDirectory = createServer({
  services: [routes],
  tls: {
    dirPath: '/etc/ssl/certs',
  },
});
```

The `TLS_DIR_PATH` environment variable sets the default directory for `getTLSPath()`:

| Variable | Default (dev) | Default (prod) |
|----------|--------------|----------------|
| `TLS_DIR_PATH` | `../../../keys` (relative to cwd) | cwd |

::: warning
In production, always set `TLS_DIR_PATH` explicitly or provide `keyPath`/`certPath` in the `tls` option.
Provide `keyPath` and `certPath` together: setting only one is rejected with an error naming the missing one.
:::

## Extending the Schema

You can compose `ConnectumEnvSchema` with your own application-specific variables using Zod's `.merge()` or `.extend()`:

```typescript
import { z } from 'zod';
import { ConnectumEnvSchema } from '@connectum/core';

const AppEnvSchema = ConnectumEnvSchema.extend({
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url().optional(),
  API_KEY: z.string().min(32),
});

type AppEnv = z.infer<typeof AppEnvSchema>;

const config: AppEnv = AppEnvSchema.parse(process.env);
```

## Configuration by Environment

These files show values to supply through your process environment. Load a local
file explicitly (for example `node --env-file=.env src/index.ts`); `parseEnvConfig()`
does not read `.env` files. Logging and OpenTelemetry still need their module
configuration; see [Observability](/en/guide/observability).

### Development `.env`

```bash
PORT=5000
NODE_ENV=development
LOG_LEVEL=debug
LOG_FORMAT=pretty
LOG_BACKEND=console
HTTP_HEALTH_ENABLED=true
GRACEFUL_SHUTDOWN_ENABLED=false
```

### Production `.env`

```bash
PORT=5000
NODE_ENV=production
LOG_LEVEL=warn
LOG_FORMAT=json
LOG_BACKEND=otel
OTEL_SERVICE_NAME=my-service
OTEL_EXPORTER_OTLP_ENDPOINT=http://otel-collector:4318
HTTP_HEALTH_ENABLED=true
GRACEFUL_SHUTDOWN_ENABLED=true
GRACEFUL_SHUTDOWN_TIMEOUT_MS=30000
TLS_DIR_PATH=/etc/ssl/connectum
```

## Docker and Kubernetes

### Dockerfile

Use the [Docker guide](/en/guide/production/docker) for dependency installation,
generated contracts, and runtime image selection. Supply the environment values
above when starting the container.

### Kubernetes Pod Spec (excerpt)

```yaml
containers:
  - name: my-service
    image: my-service:latest
    ports:
      - containerPort: 5000
    env:
      - { name: NODE_ENV, value: "production" }
      - { name: LOG_LEVEL, value: "info" }
      - { name: OTEL_SERVICE_NAME, value: "my-service" }
      - { name: HTTP_HEALTH_ENABLED, value: "true" }
      - { name: GRACEFUL_SHUTDOWN_ENABLED, value: "true" }
    livenessProbe:
      httpGet: { path: /healthz, port: 5000 }
    readinessProbe:
      httpGet: { path: /readyz, port: 5000 }
```

::: tip
Budget `terminationGracePeriodSeconds` for the pre-stop delay, connection drain,
bounded shutdown hooks, and a margin. A lower connection-drain timeout alone
does not ensure cleanup finishes; see [Graceful shutdown](/en/guide/server/graceful-shutdown#kubernetes-integration).
:::

## Related

- [Server Overview](/en/guide/server) -- quick start and key concepts
- [Graceful Shutdown](/en/guide/server/graceful-shutdown) -- shutdown hooks and Kubernetes integration
- [Custom Interceptors](/en/guide/interceptors/custom) -- creating custom interceptors
- [Custom Protocols](/en/guide/protocols/custom) -- creating protocol plugins
- [Method Filtering](/en/guide/interceptors/method-filtering) -- per-method interceptor routing
- [@connectum/core](/en/packages/core) -- Package Guide
- [@connectum/core API](/en/api/@connectum/core/) -- Full API Reference

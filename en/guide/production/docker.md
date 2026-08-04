---
title: Docker Containerization
description: Multi-stage Dockerfile, docker-compose, and image optimization for Connectum gRPC/ConnectRPC microservices.
---

# Docker Containerization

Connectum packages ship **compiled JavaScript** (`.js` + `.d.ts` + source maps), so they work on any Node.js version >= 22.13.0. If your own application code is written in TypeScript, you can either use Node.js 25+ (native type stripping for `.ts` files) or compile your code with a build tool before containerizing.

::: tip Full Example
A production `Dockerfile` is available in the [car-sharing example](https://github.com/Connectum-Framework/examples/tree/main/car-sharing).
:::

## Multi-Stage Dockerfile

### Recommended Layout

Two-stage build: install dependencies in an isolated stage, then copy only production `node_modules` into a slim runtime image (`node:25-slim` on Node.js, `oven/bun:1-slim` on Bun) with a non-root user and health check.

See [Dockerfile](https://github.com/Connectum-Framework/examples/blob/main/car-sharing/Dockerfile) for the full listing.

Key highlights:

::: runtime
== node
- **Stage 1 (deps)** -- `pnpm install --frozen-lockfile --prod` for reproducible, minimal dependencies
- **Stage 2 (runtime)** -- non-root `node` user, `curl`-based HEALTHCHECK against `/healthz`, native TypeScript via `node src/index.ts`
- Environment defaults: `NODE_ENV=production`, `PORT=5000`, `LOG_FORMAT=json`, health and graceful shutdown enabled
== bun
- **Stage 1 (deps)** -- `bun install --frozen-lockfile` for reproducible dependencies
- **Stage 2 (runtime)** -- `oven/bun:1-slim`, `curl`-based HEALTHCHECK against `/healthz`, TypeScript executed directly via `bun run src/index.ts`
- Environment defaults: `NODE_ENV=production`, `PORT=5000`, `LOG_FORMAT=json`, health and graceful shutdown enabled

The reference `Dockerfile` in the examples repository targets Node.js; the Bun variant
above mirrors it stage for stage.
:::

:::: runtime node
::: tip Base image selection
If your own application code is compiled to JavaScript (e.g., via tsup or tsx), you can use any Node.js 22+ base image instead of `node:25-slim`. Use `node:25-slim` only when you want to run your own `.ts` files natively via Node.js type stripping.
:::
::::

### HEALTHCHECK on a Plaintext h2c Server

If your server runs plaintext h2c -- `allowHTTP1: false` without TLS, the recommended
posture for internal gRPC services -- the probe **must speak HTTP/2**:

```dockerfile
HEALTHCHECK --interval=10s --timeout=3s --start-period=15s --retries=3 \
    CMD curl -fsS --http2-prior-knowledge http://localhost:${PORT:-5000}/healthz || exit 1
```

::: danger Do not probe an h2c server with `wget`
`wget` speaks HTTP/1.1 only. Against an h2c listener it receives an empty status line
and **still exits 0**, so the probe passes for any URL on an open port -- including a
path that does not exist, and including a service reporting `NOT_SERVING`. The container
is then reported healthy while being unable to serve. Verified against a running server:
`wget -q --spider .../healthz` and `wget -q --spider .../does-not-exist` both exit 0,
while `curl -fsS --http2-prior-knowledge` returns 200 for the first and fails on the
second.

`curl` alone is not enough either -- without `--http2-prior-knowledge` it reports
`Received HTTP/0.9 when not allowed` and the container never becomes healthy.
:::

`-f` makes curl fail on a non-2xx status, which is what distinguishes a healthy service
from a sick one: `/healthz` answers **200** for `SERVING` and **503** for `NOT_SERVING`
and `UNKNOWN`.

On a server that accepts HTTP/1.1 (`allowHTTP1: true`, the default) the plain
`curl -fsS http://localhost:${PORT:-5000}/healthz` is correct. If one image serves both
postures, chain the two probes with `||`.

### Runtime Command

::: runtime
== node
```dockerfile
# Node.js 25+ (native TypeScript for your own .ts files)
CMD ["node", "src/index.ts"]

# tsx (works on Node.js 22+)
CMD ["npx", "tsx", "src/index.ts"]
```

When using **tsx**, you can use any Node.js 22+ base image (e.g., `node:22-slim`, `node:24-slim`). Since `@connectum/*` packages ship compiled JavaScript, no special loader is needed for any runtime.

::: danger tsx must be a regular dependency, not a devDependency
A production image installs with `--omit=dev` (or `--prod`), so a tsx left in
`devDependencies` is **not in the image**. `npx` then tries to download it from the
registry when the container starts: with no network the container fails to start at all,
and with network every start silently fetches a package.

Verified in a container: with tsx in `devDependencies` and `--network none`, the image
exits with `request to https://registry.npmjs.org/tsx failed`. Moving tsx to
`dependencies` makes the same image start normally.

`connectum init --node-exec tsx` puts tsx in `devDependencies`, which is right for a
project that runs from source but wrong for a `--prod` image -- move it before
containerising, or pin the run command to the resolved binary
(`CMD ["./node_modules/.bin/tsx", "src/index.ts"]`) so a missing dependency fails loudly
at build time instead of at start-up.
:::
== bun
```dockerfile
FROM oven/bun:1-slim AS runtime
CMD ["bun", "run", "src/index.ts"]
```

Code generation runs the same way inside the image -- `RUN bunx buf generate`. Since
`@connectum/*` packages ship compiled JavaScript, no loader or register hook is needed.
:::

### Alpine Variant (Node.js Images)

If you need a smaller image and do not depend on native modules requiring glibc, use the Alpine variant: swap both `FROM node:25-slim` lines in the [Dockerfile](https://github.com/Connectum-Framework/examples/blob/main/car-sharing/Dockerfile) for `node:25-alpine`, and install `curl` with `apk add --no-cache curl` instead of `apt-get`. Alpine's BusyBox applets differ from the GNU builds, so re-verify the HEALTHCHECK actually reports `unhealthy` for a bad URL rather than only checking that it passes for a good one.

### Image Size Comparison (Node.js Images)

| Base Image | Approximate Size | Use Case |
|---|---|---|
| `node:25-slim` | ~200 MB | General production (recommended) |
| `node:25-alpine` | ~140 MB | Size-optimized, no native glibc modules |
| `node:25` | ~1 GB | Development only, avoid in production |

## .dockerignore

Keep images clean by excluding dependencies, tests, IDE files, dev configs, and proto sources. A minimal `.dockerignore` excludes `node_modules`, `**/*.test.ts`, `.git`, and editor/CI files so they never enter the build context.

## Docker Compose for Local Development

For local development you typically compose your Connectum services with an observability stack. A representative `docker-compose.yml` wires up:

| Service | Port | Description |
|---|---|---|
| `order-service` | 5000 | Connectum gRPC service |
| `inventory-service` | 5001 | Connectum gRPC service |
| `otel-collector` | 4317, 4318, 8889 | OpenTelemetry Collector (OTLP gRPC/HTTP, Prometheus) |
| `jaeger` | 16686 | Distributed tracing UI |
| `prometheus` | 9090 | Metrics collection |
| `grafana` | 3000 | Dashboards and visualization |

Point each service's `OTEL_EXPORTER_OTLP_ENDPOINT` at the collector (`http://otel-collector:4318`) and let the collector fan traces out to Jaeger and metrics to Prometheus.

For a runnable observability stack wired to Connectum services, see the [o11y-coroot example](https://github.com/Connectum-Framework/examples/tree/main/o11y-coroot) (it uses Coroot + ClickHouse + Prometheus rather than the Jaeger/Grafana stack tabulated above).

### OTel Collector Configuration

A minimal collector config declares an OTLP receiver, a `batch` processor, and exporters for traces and metrics. The collector receives OTLP traces and metrics, batches them, and exports them to your tracing and metrics backends.

## Image Optimization Tips

### 1. Layer Caching

Always copy `package.json` and `pnpm-lock.yaml` before source code. Docker caches the `pnpm install` layer and only re-runs it when dependencies change.

### 2. Production Dependencies Only

Use `pnpm install --frozen-lockfile --prod` to exclude devDependencies. This can reduce `node_modules` size by 50-70%.

### 3. Prune Unnecessary Files

After install, remove package manager caches:

```dockerfile
RUN pnpm install --frozen-lockfile --prod \
    && pnpm store prune
```

### 4. Use `.dockerignore` Aggressively

Every file not needed at runtime should be in `.dockerignore`. This speeds up the build context transfer and reduces image size.

### 5. Pin Base Image Digests in Production

For reproducible builds, pin to a specific image digest:

```dockerfile
FROM node:25-slim@sha256:<digest> AS runtime
```

::: warning
Never use the `latest` tag in production Dockerfiles. Always pin to a specific Node.js version (e.g., `node:25.2.0-slim`) to avoid unexpected breaking changes.
:::

## Environment Variables Reference

These environment variables configure a Connectum service inside a container:

| Variable | Description | Default |
|---|---|---|
| `NODE_ENV` | Runtime environment | `development` |
| `PORT` | Server listen port | `5000` |
| `LISTEN` | Bind address | `0.0.0.0` |
| `LOG_LEVEL` | Log verbosity (`debug`, `info`, `warn`, `error`) | `info` |
| `LOG_FORMAT` | Log output format (`json`, `pretty`) | `json` |
| `LOG_BACKEND` | Logger backend (`otel`, `pino`, `console`) | `otel` |
| `HTTP_HEALTH_ENABLED` | Enable HTTP health endpoints | `false` |
| `GRACEFUL_SHUTDOWN_ENABLED` | Enable graceful shutdown on SIGTERM/SIGINT | `true` |
| `GRACEFUL_SHUTDOWN_TIMEOUT_MS` | Shutdown timeout in ms | `30000` |
| `OTEL_SERVICE_NAME` | OpenTelemetry service name | `npm_package_name` or `unknown-service` |
| `OTEL_EXPORTER_OTLP_ENDPOINT` | OTLP collector endpoint | -- |
| `OTEL_TRACES_EXPORTER` | Trace exporter (`console`, `otlp/http`, `otlp/grpc`, `none`) | -- |
| `OTEL_METRICS_EXPORTER` | Metrics exporter | -- |
| `OTEL_LOGS_EXPORTER` | Logs exporter | -- |

## What's Next

- [Kubernetes Deployment](./kubernetes.md) -- Deploy your containerized service to Kubernetes
- [Envoy Gateway](./envoy-gateway.md) -- Expose gRPC services to REST clients
- [Service Mesh with Istio](./service-mesh.md) -- Automatic mTLS and traffic management

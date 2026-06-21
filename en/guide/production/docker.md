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

### Recommended: `node:25-slim`

Two-stage build: install dependencies in an isolated stage, then copy only production `node_modules` into a slim runtime image with a non-root user and health check.

See [Dockerfile](https://github.com/Connectum-Framework/examples/blob/main/car-sharing/Dockerfile) for the full listing.

Key highlights:

- **Stage 1 (deps)** -- `pnpm install --frozen-lockfile --prod` for reproducible, minimal dependencies
- **Stage 2 (runtime)** -- non-root `node` user, `wget`-based HEALTHCHECK against `/healthz`, native TypeScript via `node src/index.ts`
- Environment defaults: `NODE_ENV=production`, `PORT=5000`, `LOG_FORMAT=json`, health and graceful shutdown enabled

::: tip Base image selection
If your own application code is compiled to JavaScript (e.g., via tsup or tsx), you can use any Node.js 22+ base image instead of `node:25-slim`. Use `node:25-slim` only when you want to run your own `.ts` files natively via Node.js type stripping.
:::

### Alternative Runtimes: Bun and tsx

You can replace the Node.js `CMD` with Bun or tsx:

```dockerfile
# Node.js 25+ (native TypeScript for your own .ts files)
CMD ["node", "src/index.ts"]

# Bun
CMD ["bun", "src/index.ts"]

# tsx (works on Node.js 22+)
CMD ["npx", "tsx", "src/index.ts"]
```

When using **tsx**, you can use any Node.js 22+ base image (e.g., `node:22-slim`, `node:24-slim`) and add `tsx` as a dependency. Since `@connectum/*` packages ship compiled JavaScript, no special loader is needed for any runtime.

### Alpine Variant (Smaller Image)

If you need a smaller image and do not depend on native modules requiring glibc, use the Alpine variant: swap both `FROM node:25-slim` lines in the [Dockerfile](https://github.com/Connectum-Framework/examples/blob/main/car-sharing/Dockerfile) for `node:25-alpine`. Verify the HEALTHCHECK command still resolves on Alpine (its BusyBox `wget` differs from the GNU build); adjust the probe command if needed.

### Image Size Comparison

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

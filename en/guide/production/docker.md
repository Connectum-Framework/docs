---
title: Docker Containerization
description: Multi-stage Dockerfile, docker-compose, and image optimization for Connectum gRPC/ConnectRPC microservices.
docType: how-to
---

# Docker Containerization

Connectum packages ship **compiled JavaScript** (`.js` + `.d.ts` + source maps) and declare Node.js `>=22.13.0`. If your application runs TypeScript directly, use Node.js `>=25.2.0`; otherwise compile it before containerizing. The framework repository itself requires Node.js `>=26.0.0` for development.

Choose a maintained Node.js release for the image. [Node.js recommends Active or Maintenance LTS for production](https://nodejs.org/en/about/previous-releases): `node:24-slim` fits compiled applications or the `tsx` setup below. For the native-TypeScript mode described here, `node:26-slim` meets the `>=25.2.0` floor. On October 7, 2026, Node.js 26 is still Current; check the release schedule when choosing an image.

::: tip Full Example
The [car-sharing example](https://github.com/Connectum-Framework/examples/tree/main/car-sharing) includes a Dockerfile for that application.
:::

## Multi-Stage Dockerfile

### Recommended Layout

Two-stage build: install dependencies in an isolated stage, then copy only production `node_modules` into a slim runtime image (`node:26-slim` for native TypeScript, `oven/bun:1-slim` on Bun) with a non-root user and health check.

See [Dockerfile](https://github.com/Connectum-Framework/examples/blob/main/car-sharing/Dockerfile) for the full listing.

That example currently uses `node:25-slim`, an EOL release. When adapting its native-TypeScript layout, change both Node base stages to `node:26-slim`.

Key highlights:

::: runtime
== node
- **Stage 1 (deps)** -- `pnpm install --frozen-lockfile --prod` for reproducible, minimal dependencies
- **Stage 2 (runtime)** -- non-root `node` user, `curl`-based HEALTHCHECK against `/healthz`, native TypeScript via `node src/index.ts`
- The image sets `NODE_ENV=production`; the application defaults to port 5000 and explicitly configures health and automatic shutdown.
== bun
- **Stage 1 (deps)** -- `bun install --frozen-lockfile` for reproducible dependencies
- **Stage 2 (runtime)** -- `oven/bun:1-slim`, `curl`-based HEALTHCHECK against `/healthz`, TypeScript executed directly via `bun run src/index.ts`
- Set `NODE_ENV=production` in the image; configure the application's port, health and shutdown explicitly.

The reference `Dockerfile` targets Node.js. The Bun bullets describe a layout to
adapt; they are not a second executable Dockerfile shipped by the example.
:::

:::: runtime node
::: tip Base image selection
If your application code is compiled to JavaScript, use a Node.js base image at or above the package floor (`22.13.0`). Use Node.js `>=25.2.0` when running `.ts` files natively. The Bun block below is an illustrative command; the linked example's Dockerfile targets Node.js.
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
# Node.js >=25.2.0 (native TypeScript for your own .ts files)
CMD ["node", "src/index.ts"]

# tsx (works on Node.js >=22.13.0)
CMD ["npx", "tsx", "src/index.ts"]
```

When using **tsx**, the consumer Node.js floor is `>=22.13.0`. Since `@connectum/*` packages ship compiled JavaScript, no special loader is needed to load the framework packages.

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
(`CMD ["./node_modules/.bin/tsx", "src/index.ts"]`) to avoid downloads at startup.
The direct command still fails at startup if the binary is missing; add
`RUN test -x ./node_modules/.bin/tsx` in the runtime stage to check it during build.
:::
== bun
```dockerfile
FROM oven/bun:1-slim AS runtime
CMD ["bun", "run", "src/index.ts"]
```

Run code generation in the build stage after installing the project's development
tools -- `RUN bunx buf generate`. Copy its output to the runtime stage. Since
`@connectum/*` packages ship compiled JavaScript, no loader or register hook is needed.
:::

### Alpine Variant (Node.js Images)

If you need an Alpine image and your native dependencies support its libc, use `node:26-alpine` for both Node base stages, and install `curl` with `apk add --no-cache curl` instead of `apt-get`. Alpine's BusyBox applets differ from the GNU builds, so verify that the health check reports `unhealthy` for an invalid URL.

### Node.js Base Image Choices {#image-size-comparison-nodejs-images}

| Base Image | Use Case |
|---|---|
| `node:24-slim` | LTS runtime for compiled JavaScript or the production `tsx` setup |
| `node:26-slim` | Native TypeScript under the documented `>=25.2.0` floor |
| `node:26-alpine` | Native TypeScript on Alpine; check native dependencies for libc compatibility |
| `node:26` | Development or build stages that need the full image contents |

## .dockerignore

Exclude local dependencies, tests, IDE files, and Git metadata. Keep proto sources
in the build context if a build stage generates code; copy the generated output
into the runtime stage. A minimal `.dockerignore` excludes `node_modules`,
`**/*.test.ts`, `.git`, and editor/CI files.

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

Copy package-management inputs before source code: `package.json`, `pnpm-lock.yaml`,
and any required `pnpm-workspace.yaml`. Docker can reuse the install layer while
its instructions and inputs remain unchanged; see [Docker cache optimization](https://docs.docker.com/build/cache/optimize/).

### 2. Production Dependencies Only

Use `pnpm install --frozen-lockfile --prod` to exclude devDependencies from the runtime image.

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
FROM node:26-slim@sha256:<digest> AS runtime
```

::: warning
Pin the selected maintained image to a verified digest rather than using `latest`. Update that digest deliberately when applying runtime security fixes.
:::

## Runtime Configuration

Keep the container responsible for supplying configuration, not documenting a second
copy of every field. The canonical owners are:

- [Server configuration](/en/guide/server/configuration) for listen, logging, health,
  and shutdown environment values;
- [Runtime compatibility](/en/guide/runtime-compatibility) for supported Node.js and
  Bun execution modes;
- [Observability backends](/en/guide/observability/backends) for OpenTelemetry
  exporters and endpoints.

At minimum set a production environment, a stable service name, and the intended
listen port; pass secrets through the deployment platform rather than the image.

## What's Next

- [Kubernetes Deployment](./kubernetes.md) -- Deploy your containerized service to Kubernetes
- [Envoy Gateway](./envoy-gateway.md) -- Expose gRPC services to REST clients
- [Service Mesh with Istio](./service-mesh.md) -- Automatic mTLS and traffic management

# Scaffolding a New Service

The `connectum` CLI scaffolds a production-ready Connectum project and adds services to
an existing one. It fetches the dogfooded `getting-started` example as the base (so the
starter layout is always in sync with a tested example) and composes the modules you
select on top.

::: tip Requirements
`connectum init` fetches the base from GitHub, so it needs network access the first
time. It produces a standalone project that depends on the published `@connectum/*`
packages. The CLI itself is exercised on Node.js — run it with `npx` even when the
project you are scaffolding targets Bun.
:::

## `connectum init`

Create a new project. Run it interactively:

```bash
npx @connectum/cli init
```

Run the CLI with `npx` whatever you use day to day: it reaches a server through the
Node.js gRPC transport and is exercised on Node.js only. The project it generates has no
such restriction.

The wizard asks for a project name, runtime, package manager, and which modules to
include. Or pass everything as flags for a non-interactive run:

```bash
npx @connectum/cli init payments \
  --package-manager pnpm \
  --otel \
  --events nats \
  --auth \
  --yes
```

Then:

```bash
cd payments
```

::: pm
== npm
```bash
npm install
npm run start
```
== pnpm
```bash
pnpm install
pnpm run start
```
== bun
```bash
bun install
bun run start
```
:::

::: warning `--package-manager` accepts pnpm and npm only
The flag has no `bun` value today, so scaffold with `pnpm` or `npm` and install with
whatever you prefer afterwards: `bun install` works on the generated project unchanged,
since it lays out an ordinary `node_modules`. The only thing you do not get from the
scaffold is a matching lockfile.

This is independent of `--runtime bun`, which does work and is what decides whether the
generated scripts and tests target Bun.
:::

`buf generate` is wired into the `start`, `test`, and `typecheck` scripts, so the
generated code under `gen/` is always current — you never hit a "cannot find module
`#gen/...`" wall.

The generated scripts match the runtime you picked:

::: runtime
== node
- `start` — `buf generate && node src/index.ts` (raw `.ts` execution; Node >= 25.2, or `tsx` on Node >= 22.13)
- `test` — `buf generate && node --test tests/**/*.test.ts`
== bun
- `start` — `buf generate && bun src/index.ts`
- `test` — `buf generate && bun test tests/`
:::

The generated e2e test itself is runtime-agnostic: it uses the in-process
`createLocalClient`, which opens no socket and behaves identically on both runtimes.

### Options

| Flag | Values | Description |
|------|--------|-------------|
| `--runtime` | `node` (default), `bun` | Target runtime |
| `--package-manager` | `pnpm` (default), `npm` | Package manager |
| `--node-exec` | `raw` (default), `tsx` | Node execution model: `raw` runs `.ts` directly (Node ≥25.2); `tsx` compiles (Node ≥22.13) |
| `--otel` | — | Add OpenTelemetry (interceptor + provider lifecycle) |
| `--events` | `nats`, `kafka`, `redpanda`, `redis`, `amqp` | Add an EventBus with the chosen adapter |
| `--auth` | — | Add JWT authentication + proto-driven authorization |
| `--catalog` | — | Add the service catalog (typed `ctx.call` / `ctx.stream`) |
| `--resilience` | comma list of `timeout,bulkhead,circuitBreaker,retry,fallback` | Enable resilience interceptors |
| `--healthcheck` / `--no-healthcheck` | — | Include the gRPC health protocol (default on) |
| `--reflection` / `--no-reflection` | — | Include gRPC server reflection (default on) |
| `--sample` / `--no-sample` | — | Emit the runnable sample Greeter service (default on) |
| `--yes`, `-y` | — | Non-interactive; use flags and defaults |
| `--force` | — | Overwrite existing files |

### Interceptor order

When multiple interceptor-adding modules are selected, `init` emits a single, consistent
order (outermost → innermost): **OpenTelemetry → error handler → auth → validation →
resilience → your custom interceptors**. OpenTelemetry is outermost so a span always
covers the whole request, including errors.

## `connectum generate service`

Add a service to an existing project:

```bash
npx @connectum/cli generate service billing
# with an event handler too:
npx @connectum/cli generate service inventory --with-events
```

This scaffolds:

- `proto/<name>/v1/<name>.proto` — a starter service (and, with `--with-events`, an
  event-handler service annotated with a topic);
- `src/services/<name>Service.ts` — a `defineService` skeleton whose rpc handlers throw
  `Code.Unimplemented` until you implement them (and, with `--with-events`, an
  `EventRoute` with an ack-by-default handler).

It never edits your `src/server.ts` (that file is yours). Instead it prints the exact
registration to add:

```text
Register the new service in src/server.ts:
  import { billingService } from "#services/billingService.ts";
  // add billingService to the services: [...] array passed to createServer
```

## Adding a service by hand

The one-shot commands are conveniences — the underlying loop is small:

1. Add a `proto/<pkg>/v1/<file>.proto`.
2. Run `buf generate` (or just `pnpm run test` / `start` — it runs first).
3. Write `defineService(MyService, { ... })` in `src/services/`.
4. Register it in the `services: [...]` array in `src/server.ts`.

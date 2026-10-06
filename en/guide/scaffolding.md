# Scaffolding a New Service

The `connectum` CLI scaffolds a production-ready Connectum project and adds services to
an existing one. It fetches the dogfooded `getting-started` example as the base — so the
starter layout comes from a real, tested example rather than a template copy — and
composes the modules you select on top.

::: tip Requirements
`connectum init` fetches the base from GitHub, so it needs network access the first
time. It produces a standalone project that depends on the published `@connectum/*`
packages. The CLI itself is exercised on Node.js — run it with `npx` even when the
project you are scaffolding targets Bun.
:::

::: tip The base is pinned per CLI release
Each CLI release fetches a **fixed tag** of the examples repository, not its default
branch, so the same CLI version always scaffolds the same base. Pass `--ref` to fetch a
different one (`--ref main` for the latest example). Drift between the pinned base and
the live example is caught by CI on the framework repository, not by your `init`.
:::

## `connectum init`

Create a new project. Run it interactively:

```bash
npx @connectum/cli init
```

Run the CLI with `npx` whatever you use day to day: it reaches a server through the
Node.js gRPC transport and is exercised on Node.js only. The project it generates has no
such restriction.

The wizard asks for a project name (see [Project path and name](#project-path-and-name)), runtime, package manager, and which modules to
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

::: tip `--package-manager` and `--runtime` are independent
`--package-manager` decides what installs dependencies and runs scripts;
`--runtime` decides what executes your TypeScript. Either accepts `bun`, and they do
not have to agree: `bun install` lays out an ordinary `node_modules`, so a
bun-installed project runs on Node.js and an npm-installed one runs on Bun. Both
crossings are exercised in CI.
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

It also calls the project's own `buildServer()` rather than assembling a throwaway
server, so the request travels the same interceptor chain, protocols and services your
process entry starts. That matters: a test that builds its own bare server passes even
when a module has made the service unreachable.

### Options

| Flag | Values | Description |
|------|--------|-------------|
| `--runtime` | `node` (default), `bun` | Target runtime |
| `--package-manager` | `pnpm` (default), `npm`, `bun` | Package manager |
| `--node-exec` | `raw` (default), `tsx` | Node execution model: `raw` runs `.ts` directly (Node ≥25.2); `tsx` compiles (Node ≥22.13) |
| `--otel` | — | Add OpenTelemetry (interceptor + provider lifecycle) |
| `--events` | `nats`, `kafka`, `redpanda`, `redis`, `amqp` | Add an EventBus with the chosen adapter |
| `--auth` | — | Add JWT authentication + proto-driven authorization |
| `--catalog` | — | Add the service catalog (typed `ctx.call` / `ctx.stream`) |
| `--resilience` | comma list of `timeout,bulkhead,circuitBreaker,retry,fallback` | Enable resilience interceptors |
| `--healthcheck` / `--no-healthcheck` | — | Include the gRPC health protocol (default on) |
| `--reflection` / `--no-reflection` | — | Include gRPC server reflection (default on) |
| `--sample` / `--no-sample` | — | Emit the runnable sample Greeter service (default on); `--no-sample` is [config-only](#no-sample-a-config-only-project) and cannot be combined with `--auth` or `--events` |
| `--yes`, `-y` | — | Non-interactive; use flags and defaults |
| `--force` | — | Overwrite existing files |
| `--ref` | any git ref | Base example ref to fetch (advanced; defaults to the tag pinned for this CLI release) |

### Project path and name {#project-path-and-name}

The argument of `init` is the **destination path**. The package name written to
`package.json` is the last segment of that path:

```bash
npx @connectum/cli init apps/payments   # created in apps/payments, "name": "payments"
npx @connectum/cli init .               # created in the current directory, named after it
```

The name must be valid for a **new npm package**. `init` refuses, before anything is
written and naming the rule, a name that is empty, longer than 214 characters, starts with
`.`, `_` or `-`, contains whitespace, upper-case letters or a character that is not
URL-safe (including `~ ' ! ( ) *`), equals `node_modules` or `favicon.ico`, or is the name
of a Node.js core module. The name is never corrected silently: pick another path, or, for
`init .`, create the project in a directory with a valid name. A scoped name
(`@acme/payments`) is not accepted as an argument; edit `package.json` afterwards.

### `--no-sample`: a config-only project {#no-sample-a-config-only-project}

`--no-sample` leaves out the Greeter proto, the Greeter service and its end-to-end test.
The server starts with an empty service list and the project ships one smoke test that
builds the real server. Every module that does not depend on the sample (`--otel`,
`--catalog`, `--resilience`, `--healthcheck`, `--reflection`) is applied as usual.

`--auth` and `--events` build their demonstration on the Greeter service, so combining
either with `--no-sample` is an error that names both options.

`buf generate` fails on a module that holds no `.proto` file, so a `--no-sample` project
cannot run `typecheck`, `test` or `start` until it has a first service. Generate it, then
register it as printed:

```bash
cd payments
npx @connectum/cli generate service billing
```

### What `--auth` generates

Proto-driven authorization is **deny-by-default**, so the sample service is annotated to
be both usable and demonstrative:

- `SayHello` carries `option (connectum.auth.v1.method_auth) = { public: true }` — it
  skips authentication and authorization, so the scaffolded project answers a call the
  moment it starts;
- `SayGoodbye` is left unannotated — it requires a valid JWT.

The generated e2e test asserts both directions: the public rpc succeeds and the
authenticated one is rejected without credentials. Remove the option from `SayHello` once
you want every method to require a token.

### Connectum option protos

With `--auth` or `--events`, your protos import Connectum's option protos
(`connectum/auth/v1/options.proto`, `connectum/events/v1/options.proto`), but the project
does not generate code for them. The generated code imports their descriptors from the
packages instead — `@connectum/auth/gen/connectum/auth/v1/options_pb.js` and
`@connectum/events/gen/connectum/events/v1/options_pb.js`, the same modules the packages
use at runtime. The generated `buf.gen.yaml` does this with one `directory: proto` input
(with events, `proto/connectum/events/v1` — where the CLI writes its copy of the events
option proto — is excluded) and `map_imports` options on `protoc-gen-es`:

```yaml
inputs:
  - directory: proto
    exclude_paths:
      - proto/connectum/events/v1
plugins:
  - local: protoc-gen-es
    out: gen
    opt:
      - target=ts
      - import_extension=.ts
      - erasable_syntax=true
      - map_imports=connectum/auth/v1/:@connectum/auth/gen
      - map_imports=connectum/events/v1/:@connectum/events/gen
```

Those package exports first ship in 1.3.0, so `init` sets every `@connectum/*`
dependency of such a project to one range — the highest `@connectum/*` requirement of the
fetched base, or `^1.3.0` if that is higher, so no base entry is lowered (also with
`--ref`). One range for the whole set matters: mixed
`@connectum/*` versions can install two copies of `@bufbuild/protobuf`. A project without
auth or events keeps the base's ranges. In a project scaffolded with `--events`,
`generate service --with-events` writes the events option proto to the same excluded
path, so a new event-handler service also imports the descriptor from
`@connectum/events`. Projects scaffolded before 1.3.0 can adopt this by
hand: [Option descriptors from the packages](/en/migration/option-descriptor-imports).

### Enums in generated code

A Node.js project runs its TypeScript by stripping types and type-checks with
`erasableSyntaxOnly`, and neither accepts a TypeScript `enum`. The generated
`buf.gen.yaml` therefore passes `erasable_syntax=true` to `protoc-gen-es`, so each
Protobuf enum in your protos is generated as an `as const` object plus a type of the
same name:

```typescript
export const Color = { UNSPECIFIED: 0, RED: 1, GREEN: 2 } as const;
export type Color = (typeof Color)[keyof typeof Color] | UnknownEnum;
```

- `Color.RED` works as a value, as with an `enum`.
- There is no reverse mapping: `Color[1]` is `undefined` and a type error.
- For the type of a single value, write `typeof Color.RED`.
- An open (proto3) enum's type also admits `UnknownEnum`.

The option needs `@bufbuild/protoc-gen-es` and `@bufbuild/protobuf` 2.13.0 or later.
`init` declares both at `^2.16.0` — raising a lower range from the base, including a
base fetched with `--ref` — and keeps a base range that is already higher. Details and
the full comparison with TypeScript enums: [Proto Enums](/en/guide/typescript/proto-enums).

### Interceptor order

When multiple interceptor-adding modules are selected, `init` emits a single, consistent
order (outermost → innermost): **OpenTelemetry → error handler → auth → validation →
resilience → your custom interceptors**. OpenTelemetry is outermost so a span always
covers the whole request, including errors.

### Dependency build scripts under pnpm

pnpm 11 and later stop the first `pnpm install` with `ERR_PNPM_IGNORED_BUILDS` when a
dependency has a build script that the project neither approves nor denies. With
`--package-manager pnpm`, `init` therefore writes an `allowBuilds` map in
`pnpm-workspace.yaml` that covers every module combination:

```yaml
allowBuilds:
  '@bufbuild/buf': true
  esbuild: true
  protobufjs: false
```

`@bufbuild/buf` and `esbuild` stay approved, because their scripts locate or download the
platform binary the project needs. `protobufjs` arrives with the OpenTelemetry module's
OTLP gRPC exporters; its script only prints a warning and has no effect at runtime, so it
is denied. A project scaffolded with `--otel` before this was added fails its first
`pnpm install`; add `protobufjs: false` under `allowBuilds` in its `pnpm-workspace.yaml`.

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

## `connectum proto sync`

Generate TypeScript types from a **running** server through gRPC reflection, without
access to its `.proto` files:

```bash
npx @connectum/cli proto sync --from localhost:5000 --out ./generated
# list what would be synced, generate nothing:
npx @connectum/cli proto sync --from localhost:5000 --out ./generated --dry-run
```

| Flag | Description |
|------|-------------|
| `--from` | Server address, with or without `http://` (required) |
| `--out` | Output directory for the generated types (required) |
| `--template` | Path to a custom `buf.gen.yaml` |
| `--dry-run` | Connect, list the services and files, generate nothing |
| `--timeout` | Time limit of each reflection request in milliseconds: an integer from 1 to 2147483647 (default `10000`) |

The command either obtains a descriptor for **every** service the server lists or fails
with a non-zero exit code. If the server lists a service that reflection cannot describe,
the error names each such service and nothing is generated (this holds for `--dry-run`
too). A server that accepts the connection but never answers ends with an error naming the
address and the limit, rather than waiting forever; raise `--timeout` for a slow server.

## Adding a service by hand

The one-shot commands are conveniences — the underlying loop is small:

1. Add a `proto/<pkg>/v1/<file>.proto`.
2. Run `buf generate` (or just `pnpm run test` / `start` — it runs first).
3. Write `defineService(MyService, { ... })` in `src/services/`.
4. Register it in the `services: [...]` array in `src/server.ts`.

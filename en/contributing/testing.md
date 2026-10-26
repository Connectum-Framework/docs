---
title: Testing the Framework
description: How tests for the Connectum packages are written, where they live, and how integration suites find their message brokers.
docType: contributor-guide
---

# Testing the Framework

This page describes how tests for the `@connectum/*` packages themselves are written. To
test a service built with Connectum, use the
[Testing guide](/en/guide/testing) and the
[`@connectum/testing`](/en/packages/testing) package instead. For the commands that run
the suites, see [CLI Commands](/en/contributing/cli-commands).

## Test runner and APIs

Tests are written against the built-in Node.js test API: `describe`, `it`, `before`,
`afterEach` and `mock` from `node:test`, and assertions from `node:assert`. There is no
Jest, Vitest, or Mocha.

The packages do not run them with `node --test`. Each package's `test` script calls
[`@exodus/test`](https://www.npmjs.com/package/@exodus/test) (`exodus-test`), a runner for the same
`node:test` API that can execute one set of test files on several engines:

| Script | Runs |
|---|---|
| `test`, `test:unit`, `test:integration` | `exodus-test --typescript` on Node.js, running the `.ts` files directly |
| `test:bun` | `exodus-test --engine bun:pure`, the same files on Bun |
| `test:esbuild` | `exodus-test --esbuild`, the same files transpiled by esbuild |

In `@connectum/core` the scripts are defined in `packages/core/package.json`. The Bun
and esbuild scripts select the files that are meaningful on that engine, so a package
may run fewer files there than under `test`. Because the same tests run on Node.js and
Bun, write them against the `node:test` API only and do not rely on a Node.js-only
behavior without a reason. Run `pnpm test:bun` before you push a change that touches
runtime-sensitive code.

## Where tests live

Tests are not placed next to the sources. Each package keeps them in a `tests/`
directory beside `src/`:

```text
packages/<name>/
  src/
  tests/
    unit/          # one module or behavior, no external services
    integration/   # real sockets, real brokers
    fixtures/      # generated protobuf code and sample data (where needed)
    helpers/       # shared test code (where needed)
```

Test files are named `<subject>.test.ts`. The subject follows the file it covers
(`enabledServices.test.ts` for `src/enabledServices.ts`, `Server.test.ts` for
`src/Server.ts`) or the behavior it pins down (`Server.listenerSafety.test.ts`). Integration
files in the broker packages carry an `.integration` infix in some packages and a broker
prefix in others (`RedisAdapter.integration.test.ts`, `amqp-broker.test.ts`); follow the
package you are working in.

## Writing a test

A real file from `@connectum/core`, shortened (`packages/core/tests/unit/enabledServices.test.ts`):

```typescript
import assert from "node:assert";
import { describe, it } from "node:test";
import { enabledServicesFromEnv } from "../../src/enabledServices.ts";

describe("enabledServicesFromEnv", () => {
    // The value goes straight into `createServer({ enabledServices })`, where `undefined`
    // mounts every supplied service and a list mounts only the listed ones, so a variable
    // that names no service has to stay `undefined` instead of becoming an empty list.
    it("returns undefined, the server's mount-everything default, when the variable names no service", () => {
        assert.equal(enabledServicesFromEnv(undefined), undefined);
        assert.equal(enabledServicesFromEnv(""), undefined);
    });
});
```

Conventions you will see across the repository:

- **Assertions.** Both `node:assert` (`import assert from "node:assert"`) and
  `node:assert/strict` are used. Prefer the strict forms (`strictEqual`,
  `deepStrictEqual`) or the strict module, and use `assert.throws` /
  `await assert.rejects` for errors.
- **Names.** `describe` names the function, class, or behavior under test, and `it`
  states the behavior the test pins down. Two styles occur: `should <behavior>`
  (`should match exact method pattern`) and a plain present-tense statement
  (`rejects a token that has no exp claim by default`). No tool picks one; say what
  must happen and under which condition.
- **A test names the defect it catches.** When the reason is not obvious from the name,
  a comment above the test states it, as in the example.
- **Cleanup.** Close servers and connections, restore mocks, and restore environment
  variables in `afterEach`, so one test cannot affect the next.
- **Mocking.** Use `mock` from `node:test`. [ADR-007](/en/contributing/adr/007-testing-strategy)
  records the intent: mock external dependencies (HTTP requests, the file system,
  external APIs, time-dependent code), not the package's own functions.
- **Shared helpers.** `@connectum/testing` provides local clients, mock contexts, and the
  `transportParityTest()` driver, and `@connectum/test-fixtures` provides mock requests,
  descriptors, and streams. See [`@connectum/test-fixtures`](/en/packages/test-fixtures)
  for what it offers.

Tests are not covered by the Biome formatter or linter (`biome.json` excludes
`**/*.test.*`), but they are type-checked: the root `tsconfig.json` includes
`packages/*/tests/**/*.ts`.

## Parity tests

A change to observable RPC behavior needs a scenario in the cross-transport parity suite
that proves the HTTP/2 and in-process transports behave the same. See
[Parity Invariant](/en/contributing/parity-invariant) and
[Parity Coverage](/en/contributing/parity-coverage); the pull request template asks for
this explicitly.

## Integration tests and brokers

Suites that need a real message broker are skipped, with a stated reason, when the
broker is not configured: they are reported as skipped instead of failing. The variables
that switch them on:

| Variable | Enables | Value |
|---|---|---|
| `NATS_TEST_URL` | `@connectum/events-nats` integration suites | URL of a JetStream-enabled server, for example `nats://localhost:4222` |
| `KAFKA_TEST_URL` | `@connectum/events-kafka` integration suites | Comma-separated bootstrap servers of a real single-node broker |
| `REDIS_TEST_URL` | `@connectum/events-redis` integration suites | A Redis 6.2+ or Valkey endpoint |
| `AMQP_TEST_URL` | `@connectum/events-amqp` broker suites | URL of a running RabbitMQ broker |
| `RUN_RECOVERY_TESTS=1` | `@connectum/events-amqp` suites that start RabbitMQ with Testcontainers | Needs a container runtime |

A suite declares the dependency on its first `describe`, for example:

```typescript
const NATS_TEST_URL = process.env.NATS_TEST_URL;

describe("NATS adapter lifecycle events", { skip: NATS_TEST_URL === undefined ? "NATS_TEST_URL not set" : false, concurrency: 1 }, () => {
    // ...
});
```

Run one suite against a broker with the variable set and the file path, for example:

```bash
cd packages/events-nats
NATS_TEST_URL=nats://localhost:4222 pnpm exec exodus-test --typescript tests/integration/NatsLifecycle.integration.test.ts
```

The header comment of an integration file names the variable it needs. The
RabbitMQ image used by the container-based suites is pinned to an exact version in
`packages/events-amqp/tests/integration/brokerImage.ts`, and `AMQP_BROKER_IMAGE`
overrides it for a single run.

## Coverage

No coverage threshold is configured: no package script or CI step measures or gates
coverage. ADR-007 records coverage targets as goals for the project; treat them as a
guide to what a change should exercise, not as a check that will pass or fail. The
review question is whether the tests prove the behavior you changed, including the
failure paths, not what percentage of lines they touch.

## Related

- [CLI Commands](/en/contributing/cli-commands)
- [Pull Requests](/en/contributing/pull-requests)
- [Testing guide for service authors](/en/guide/testing)

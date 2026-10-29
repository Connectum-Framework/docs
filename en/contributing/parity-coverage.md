---
title: Parity Coverage Report
description: Inventory the scenarios that compare HTTP and in-process service behavior.
docType: contributor-guide
---

# Parity Coverage Report

This page reports the current coverage of the
[cross-transport parity invariant](./parity-invariant.md). It is updated
manually when parity scenarios are added or removed; the underlying numbers
can be regenerated from the parity test files at any time.

This is a source inventory, not a record of a successful test run. Run the parity
suite on the revision you intend to validate.

## Scenarios by group

| Group | Surface | File | Scenarios |
|------:|---------|------|----------:|
| 3 | Server-side interceptor ordering (3.1), header injection through a symmetric server interceptor (3.2), successful-call smoke checks for timeout (3.3a), retry (3.3b), bulkhead (3.3c), circuit-breaker (3.3d), logger (3.3e), serializer (3.3f) | `packages/testing/tests/parity/interceptors.parity.test.ts` | **8** |
| 3a | Proto-declared validation on the shipped chain `createDefaultInterceptors()` with real `buf.validate` annotations (success, single-rule violation, aggregated violations, client-streaming validation, no-bypass API). Violations are compared as `ConnectError.details`: wire bytes plus decoded field path, rule id, and message | `packages/testing/tests/parity/validation.parity.test.ts` | **5** |
| 3b | Proto-declared authn and authz on the shipped `createErrorHandlerInterceptor` + `createJwtAuthInterceptor` + `createProtoAuthzInterceptor` chain with real `connectum.auth.v1` options (success with scope and verified subject in the handler, unauthenticated, permission denied, public method served anonymously, no-bypass API) | `packages/auth/tests/parity/authorization.parity.test.ts` | **5** |
| 3c | Verified identity inside server-streaming and bidi handlers (before the first suspension, after an await, after a yield, in `finally`) | `packages/auth/tests/parity/auth-stream-identity.parity.test.ts` | **1** |
| 4 | Streaming & cancellation (unary, server-stream, client-stream, bidi, unary cancel, stream mid-cancel, handler cleanup after abort, handler cleanup after break + abort) | `packages/testing/tests/parity/streaming.parity.test.ts` | **8** |
| 5 | Error mapping (`ConnectError(NotFound)`, plain `Error` → `internal`, interceptor-thrown error) | `packages/testing/tests/parity/errors.parity.test.ts` | **3** |
| 6 | HTTP / local coexistence (concurrent observation by one interceptor; `server.start()` not required for local invoke) | `packages/testing/tests/parity/coexistence.parity.test.ts` + `packages/core/tests/integration/localTransport.test.ts` | **2** |
| 7a | OTEL tracing & metrics (unary spans, streaming events, error spans, metrics labels, trace-context propagation, instrument subset, `connectum.transport` attribute) | `packages/otel/tests/parity/otel.parity.test.ts` | **7** |
| 8 | Request admission (rejecting `requestGate`, `requestGate` throwing a plain `Error`, admitting `requestGate`, `readMaxBytes` over the limit, `readMaxBytes` at the limit, `server.stop()` aborting an in-flight call) | `packages/testing/tests/parity/requestAdmission.parity.test.ts` | **6** |
| 9 | gRPC Server Reflection (one bidi stream with every request kind: listing, import closure, per-stream "already sent" state, symbol and extension lookup, error answers; the reflection service described by symbol; a bounded error message and a refused oversized request) | `packages/testing/tests/parity/reflection.parity.test.ts` | **3** |
| **Total** | | | **48** |

Of these, **37 scenarios** (groups 3, 3a, 3b, 3c, 4, 5, 8, 9, except the two
no-bypass checks of groups 3a and 3b, which are standalone tests) go through the unified
`transportParityTest()` driver in `@connectum/testing/parity` and produce a
structural diff between HTTP and local. The 7 OTEL scenarios and 2 coexistence
scenarios are written as paired `test()` cases that drive both transports
explicitly and assert equality of observable signals — semantically equivalent
to the driver, but expressed in long form because they need bespoke
exporter setup (OTEL) or asymmetric assertions (coexistence).

## Coverage analysis

Observable behaviours that a service can produce, and their current parity
coverage:

| Observable behaviour | Covered |
|---|:---:|
| Response payload (unary) | ✅ groups 3a / 3b / 5 |
| Response payload (streaming) | ✅ group 4 |
| Response headers / trailers | ✅ group 3 (via driver diff) |
| `ConnectError` code / message | ✅ groups 3a / 3b / 5 |
| `ConnectError` metadata / details | ✅ groups 3a / 3b |
| Streaming message order | ✅ group 4 |
| Cancellation propagation | ✅ group 4 (5, 6) |
| Handler-side cleanup after cancellation (`finally`, `context.signal`) | ✅ group 4 (7, 8) |
| Interceptor chain order | ✅ group 3 |
| Validation interceptor outcomes | ✅ group 3a |
| Auth/authz interceptor outcomes | ✅ groups 3b / 3c |
| OTEL span attributes / status | ✅ group 7a |
| OTEL span events (streaming) | ✅ group 7a |
| OTEL trace-context propagation | ✅ group 7a |
| OTEL metrics (names, labels, values) | ✅ group 7a |
| Coexistence (one server, two transports) | ✅ group 6 |
| Server lifecycle (local before `start()`) | ✅ group 6.2 |
| Request admission (`requestGate`, `readMaxBytes`) | ✅ group 8 |
| Server shutdown aborts in-flight calls | ✅ group 8 |
| Protocol answers (gRPC Server Reflection) | ✅ group 9 |

Behaviours **not** covered by parity (by design, see
[`parity-invariant.md`](./parity-invariant.md#when-parity-does-not-apply)):
TLS, HTTP/2 framing, content-encoding negotiation, `:authority` /
real-host `req.url`, gzip — these are wire-only and have no in-process
analogue. The diagnostic text of a `readMaxBytes` rejection is the one
documented message exception; group 8 still compares its code and limit.

The table names the surfaces exercised by these scenarios; it does not measure the
fraction of all possible service behavior covered. In particular, the interceptor
smoke cases compare successful response payloads, not timeout, retry, breaker, or
bulkhead failure behavior. The logger case does not compare sink output. Use the scenario implementations and the latest suite output to assess a change.

## How to add a scenario

1. Pick the right file in `packages/testing/tests/parity/` (or
   `packages/otel/tests/parity/` for observability, or
   `packages/auth/tests/parity/` for authentication and authorization, which
   cannot live in `@connectum/testing` because that package would then depend on
   `@connectum/auth`, which already depends on it).
2. For most cases, wrap the scenario with `transportParityTest`:

   ```typescript
   transportParityTest("group N.M: short title", {
     services: [myRoutes],
     scenario: async ({ transport }) => {
       const client = createClient(MyService, transport);
       return { response: await client.myMethod({ /* ... */ }) };
     },
   });
   ```
3. From the framework repository root, run `bash ./scripts/parity-suite.sh` locally.
4. Update the table above.

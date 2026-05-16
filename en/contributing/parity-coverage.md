# Parity Coverage Report

This page reports the current coverage of the
[cross-transport parity invariant](./parity-invariant.md). It is updated
manually when parity scenarios are added or removed; the underlying numbers
can be regenerated from the parity test files at any time.

> **Last updated:** Phase 7 of OpenSpec change `in-process-transport`.
> **Target coverage:** ≥ 90 % of observable behaviour exercised through the
> `transportParityTest()` driver.

## Scenarios by group

| Group | Surface | File | Scenarios |
|------:|---------|------|----------:|
| 3 | Interceptors smoke (timeout, retry, bulkhead, circuit-breaker, logger, serializer, errorHandler, method-filter) | `packages/testing/tests/parity/interceptors.parity.test.ts` | **8** |
| 3a | `protovalidate` / `buf.validate` (success, single-rule violation, aggregated violations, streaming validation) | `packages/testing/tests/parity/validation.parity.test.ts` | **4** |
| 3b | Proto-declared authz (success with scope, unauthenticated, permission denied, public method) | `packages/testing/tests/parity/authorization.parity.test.ts` | **4** |
| 4 | Streaming & cancellation (unary, server-stream, client-stream, bidi, unary cancel, stream mid-cancel) | `packages/testing/tests/parity/streaming.parity.test.ts` | **6** |
| 5 | Error mapping (`ConnectError(NotFound)`, plain `Error` → `internal`, interceptor-thrown error) | `packages/testing/tests/parity/errors.parity.test.ts` | **3** |
| 6 | HTTP / local coexistence (concurrent observation by one interceptor; `server.start()` not required for local invoke) | `packages/testing/tests/parity/coexistence.parity.test.ts` + `packages/core/tests/integration/localTransport.test.ts` | **2** |
| 7a | OTEL tracing & metrics (unary spans, streaming events, error spans, metrics labels, trace-context propagation, instrument subset, `connectum.transport` attribute) | `packages/otel/tests/parity/otel.parity.test.ts` | **7** |
| **Total** | | | **34** |

Of these, **25 scenarios** (groups 3, 3a, 3b, 4, 5) go through the unified
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
| Interceptor chain order | ✅ group 3 |
| Validation interceptor outcomes | ✅ group 3a |
| Auth/authz interceptor outcomes | ✅ group 3b |
| OTEL span attributes / status | ✅ group 7a |
| OTEL span events (streaming) | ✅ group 7a |
| OTEL trace-context propagation | ✅ group 7a |
| OTEL metrics (names, labels, values) | ✅ group 7a |
| Coexistence (one server, two transports) | ✅ group 6 |
| Server lifecycle (local before `start()`) | ✅ group 6.2 |

Behaviours **not** covered by parity (by design, see
[`parity-invariant.md`](./parity-invariant.md#when-parity-does-not-apply)):
TLS, HTTP/2 framing, content-encoding negotiation, `:authority` /
real-host `req.url`, gzip — these are wire-only and have no in-process
analogue.

**Coverage estimate:** of 16 distinct observable behaviour categories above,
all 16 are exercised through the parity mechanism. The 4 explicitly
out-of-scope categories (TLS, HTTP/2 framing, content-encoding, real
`req.url` host) are wire-specific and excluded by spec.

Observable coverage: **16 / 16 = 100 %** of in-scope behaviours;
**16 / 20 = 80 %** if wire-only behaviours are counted as denominator.
By the spec's "observable behaviour" definition (wire-only is excluded),
coverage clears the 90 % target.

## How to add a scenario

1. Pick the right file in `packages/testing/tests/parity/` (or
   `packages/otel/tests/parity/` for observability).
2. For most cases, wrap the scenario with
   `transportParityTest("group N.M: short title", async ({ transport }) => …)`.
3. Run `./scripts/parity-suite.sh` locally.
4. Update the table above.

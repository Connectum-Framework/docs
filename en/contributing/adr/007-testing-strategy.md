# ADR-007: Testing Strategy

## Status

**Accepted** - 2025-12-24

> **Update (2026-02-14)**: Added `@connectum/testing` package specification — mock factories, assertion helpers, and test server utility to eliminate test boilerplate (135+ duplicates identified). Design influenced by [connect-es](https://github.com/connectrpc/connect-es) and [protobuf-es](https://github.com/bufbuild/protobuf-es) testing patterns. See [Testing Utilities](#testing-utilities-connectumtesting) section.

---

## Context

### Target Environment

**Embedded devices in production**:
- Critical industrial/medical systems (high reliability requirements)
- Long-running processes (months/years without restart)
- No remote debugging (isolated networks)
- Expensive physical access (embedded devices in the field)

**Quality requirements**:
- Target uptime: 99.9%+ (mission-critical systems)
- Zero tolerance for crashes -- failures can have serious consequences
- High confidence in releases -- no ability to quick-fix in production
- Must catch bugs before deployment

### Why Comprehensive Testing is Critical

1. **No Production Debugging** -- isolated networks mean no remote access for troubleshooting
2. **Expensive Failures** -- physical site visits are costly and slow
3. **Mission-Critical** -- industrial/medical systems require high reliability
4. **Long-Running Processes** -- bugs may only manifest after days/weeks
5. **Limited Rollback** -- can't easily rollback on embedded devices

| Component | Target Coverage | Priority |
|-----------|----------------|----------|
| Core (server factory) | 95%+ | P0 |
| Interceptors | 90%+ | P0 |
| Otel (observability) | 85%+ | P1 |
| Testing utilities | 90%+ | P2 |

---

## Decision

**Use [node:test](https://nodejs.org/api/test.html) (native Node.js test runner) for comprehensive testing of all Connectum packages with a target coverage of 90%+.**

### Why node:test?

1. **Native Node.js** -- built-in to Node.js 25.2.0+ (zero dependencies)
2. **Zero Configuration** -- works out of the box
3. **TypeScript Support** -- works with native type stripping (no build step)
4. **Lightweight** -- minimal overhead
5. **Modern API** -- `describe`/`it`/`assert`, similar to Jest/Mocha
6. **Coverage Built-in** -- `--experimental-test-coverage` flag
7. **Parallel Execution** -- runs tests in parallel by default
8. **Stable** -- stable since Node.js 20

### Test Structure

```
packages/<name>/
  src/
  tests/
    unit/               # Isolated unit tests
      <module>.test.ts
    integration/        # Full-stack integration tests (when needed)
      <scenario>.test.ts
```

- `tests/` directory at package root (sibling to `src/`)
- Test file naming: `<module-name>.test.ts`
- Test files mirror source file organization

### Testing Philosophy

**1. Mock Only External Dependencies**

Mock HTTP requests, file system, external APIs, time-dependent code. Do NOT mock internal functions, internal modules, shared utilities, or pure functions from the same package.

**2. Unit vs Integration Tests**

- **Unit tests** (`tests/unit/`): single function/class in isolation, mock all external deps, fast (<100ms per test), 90%+ coverage target
- **Integration tests** (`tests/integration/`): multiple components working together, minimal mocking, focus on critical paths

**3. Descriptive Test Names**

Format: `should <expected behavior> [when <condition>]`

```typescript
describe('circuit breaker', () => {
  it('should pass request when circuit closed');
  it('should open circuit after threshold failures');
  it('should reject requests when circuit open');
});
```

**4. Test Edge Cases**

Always test: happy path, invalid input, empty/null/undefined values, boundary values, error conditions, concurrent access.

**5. Strict Assertions**

```typescript
import assert from 'node:assert';

assert.strictEqual(result, expected);       // strict equality
assert.deepStrictEqual(obj1, obj2);         // deep strict equality
assert.throws(() => fn(bad), /message/);    // sync errors
await assert.rejects(() => asyncFn(bad), /message/); // async errors
```

**6. Cleanup After Tests**

Always close servers/connections, clear timers, reset mocks, delete temp files, and restore env variables in `afterEach`.

### Testing Utilities (@connectum/testing)

Analysis of the existing test suite (216 tests across 3 packages) revealed significant boilerplate duplication:

| Pattern | Duplicates | Example |
|---------|-----------|---------|
| Mock interceptor request | 50+ | `{ url, stream, message, service, method } as any` |
| Mock next function | 35+ | `mock.fn(async () => ({ message: ... }))` |
| ConnectError assertions | 50+ | `assert(err instanceof ConnectError); assert.strictEqual(err.code, ...)` |
| DescMessage/Field/Method mocks | 10+ | 20-line objects with kind, typeName, fields, file, proto |
| Streaming mock generators | 5+ | `async function* mockStream() { yield ... }` |

**Decision**: Create `@connectum/testing` package (Layer 2) with the following API:

**Phase 1 — Mock Factories & Assertions (P0):**
- `createMockRequest(options?)` — mock interceptor request with sensible defaults
- `createMockNext(options?)` — successful next function wrapped in `mock.fn()` for spy capabilities
- `createMockNextError(code, message?)` — next that throws ConnectError
- `createMockNextSlow(delay, options?)` — delayed next for timeout/retry testing
- `assertConnectError(error, code, pattern?)` — type-safe assertion with `asserts` narrowing

**Phase 2 — Protobuf Descriptor Mocks & Streaming (P1):**
- `createMockDescMessage(typeName, options?)` — structurally valid DescMessage
- `createMockDescField(localName, options?)` — DescField with isSensitive support
- `createMockDescMethod(name, options?)` — DescMethod with input/output descriptors
- `createMockStream(items, options?)` — AsyncIterable from array

**Phase 3 — Test Server (P2):**
- `createTestServer(options)` — real ConnectRPC server on random port
- `withTestServer(options, testFn)` — lifecycle wrapper with automatic cleanup

#### Design Decisions for @connectum/testing

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Mock objects vs runtime proto compilation | Mock objects | No protoc/buf dependency at test time; matches existing patterns; simpler setup |
| `mock.fn()` in createMockNext | Yes (node:test) | Spy capabilities (call count, args) needed; node:test is the project standard |
| Both createTestServer + withTestServer | Yes | beforeEach/afterEach vs single-test convenience |
| No re-exports of Code/ConnectError | Correct | Users import directly from @connectrpc/connect; avoids coupling |

#### Upstream Influence

- **connect-es**: `useNodeServer()` pattern (start server before test, close after) → inspired `createTestServer` / `withTestServer`
- **protobuf-es**: `node:test` + `node:assert`, descriptor-driven parameterized tests, `compileMessage()` for runtime proto compilation (rejected — too heavy for our use case)

Full API specification: `connectum/packages/testing/README.md`

### Running Tests

```bash
pnpm test                    # All tests (unit + integration)
pnpm test:unit               # Unit tests only
pnpm test:integration        # Integration tests only

pnpm --filter @connectum/core test               # Specific package
pnpm test -- --experimental-test-coverage         # With coverage
pnpm test -- --watch                              # Watch mode
pnpm test -- --test-concurrency=1                 # Sequential (debugging)
```

---

## Consequences

### Positive

1. **High Confidence in Releases** -- 90%+ coverage catches most bugs before production; regression tests prevent breakage
2. **Fast Development Velocity** -- tests provide fast feedback (15s execution), safe refactoring
3. **No External Dependencies** -- node:test is built-in, zero config, stable API
4. **Embedded Device Friendly** -- native execution, fast startup, minimal memory footprint
5. **CI/CD Ready** -- built-in coverage reporting, parallel execution, exit codes for validation

### Negative

1. **Initial Development Overhead** -- writing tests takes upfront time. Mitigated: tests pay off quickly via early bug detection and faster refactoring.
2. **Test Maintenance** -- tests must be updated with code changes; brittle tests can slow development. Mitigated: focus on behavior testing, not implementation.
3. **Coverage != Bug-Free** -- 90% coverage does not guarantee zero bugs. Mitigated: combine with manual testing and production monitoring.
4. **Limited node:test Features** -- no snapshot testing, no DOM testing, basic coverage reporting. Acceptable for server-side Node.js (no DOM needed).

---

## Alternatives Considered

| # | Alternative | Rating | Why Rejected |
|---|-------------|--------|--------------|
| 1 | Jest | 4/5 | External dependency (~2MB), requires build step for TypeScript, slow startup, overkill for server-side Node.js |
| 2 | Mocha + Chai | 3/5 | Multiple dependencies, requires build step, fragmented ecosystem |
| 3 | AVA | 3/5 | External dependency, requires build step, different API, smaller community |
| 4 | Vitest | 3.5/5 | Requires Vite, designed for frontend projects, additional complexity |
| **-** | **node:test (chosen)** | **5/5** | **Native, zero-config, TypeScript support via type stripping, fast, stable** |

---

## Implementation Results

**Total tests: 216** (198 unit + 18 integration), **92% overall coverage**.

| Package | Unit | Integration | Total | Coverage |
|---------|------|-------------|-------|----------|
| interceptors | 77 | 18 | 95 | 92% |
| core | 49 | 0 | 49 | 94% |
| otel | 24 | 0 | 24 | 88% |
| testing | 0 | 0 | 0 | Planned |
| **Total** | **198** | **18** | **216** | **92%** |

All tests passing (100% pass rate). Test execution time ~15s.

---

## References

- [node:test Documentation](https://nodejs.org/api/test.html) -- official docs, coverage, mocking
- [Test Pyramid](https://martinfowler.com/bliki/TestPyramid.html) -- Martin Fowler
- [ADR-001: Native TypeScript Migration](./001-native-typescript-migration.md)
- [ADR-003: Package Decomposition](./003-package-decomposition.md) -- @connectum/testing as Layer 2
- [ADR-006: Resilience Pattern Implementation](./006-resilience-pattern-implementation.md)
- [connect-es](https://github.com/connectrpc/connect-es) -- upstream testing patterns (Jasmine, useNodeServer)
- [protobuf-es](https://github.com/bufbuild/protobuf-es) -- upstream testing patterns (node:test, descriptor-driven tests)

## Changelog

| Date | Author | Change |
|------|--------|--------|
| 2025-12-24 | Claude | Initial ADR -- testing strategy with node:test |
| 2026-02-14 | Claude | Added @connectum/testing package specification (mock factories, assertions, test server) |

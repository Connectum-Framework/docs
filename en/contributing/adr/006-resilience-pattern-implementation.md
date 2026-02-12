# ADR-006: Resilience Pattern Implementation

## Status

**Accepted** - 2025-12-24

> **Update (2026-02-06)**: Per ADR-010 (Framework vs Infrastructure), resilience interceptors (circuit breaker, timeout, bulkhead, fallback, retry) are now **optional (opt-in)**. They are not included in the default interceptor chain of createServer(). Users explicitly attach the interceptors they need. For standalone deployments without Envoy/proxy, they are still recommended.

---

## Context

### Target Environment

**Embedded devices in isolated networks**:
- Services run on embedded devices (edge computing)
- Isolated networks with no access to cloud infrastructure
- No managed cloud services, no external monitoring/alerting

**High availability requirements**:
- Target uptime: 99.9%+ (critical industrial/medical systems)
- Failure isolation: one service failure must not cause cascading failures
- Graceful degradation: system must continue in degraded mode
- Self-healing: automatic recovery without human intervention

### Why Resilience Patterns are Critical

1. **No Cloud Fallback** -- no external services available in isolated networks
2. **Resource Constraints** -- embedded devices have limited CPU/memory
3. **Cascading Failure Risk** -- one slow/failing service can block the entire system
4. **Human Intervention Cost** -- physical access to embedded devices is expensive and slow
5. **Safety-Critical** -- industrial/medical systems require high availability

| Pattern | Purpose | Priority |
|---------|---------|----------|
| Circuit Breaker | Prevent cascading failures | P0 |
| Timeout | Prevent resource exhaustion | P0 |
| Bulkhead | Isolate failures | P0 |
| Fallback | Graceful degradation | P1 |
| Retry | Transient failure recovery | P1 |

---

## Decision

**Use [cockatiel](https://github.com/connor4312/cockatiel) library for resilience pattern implementation in Connectum.**

### Why cockatiel?

1. **Production-ready** -- battle-tested in Microsoft VSCode, Azure SDK
2. **TypeScript-first** -- native TypeScript support, excellent typing
3. **Comprehensive** -- all required patterns in one library
4. **Zero dependencies** -- standalone, no external deps
5. **Lightweight** -- ~10KB minified, suitable for embedded devices
6. **Well-documented** -- excellent documentation and examples

### Implemented Patterns

#### 1. Circuit Breaker

Prevents cascading failures by failing fast when a downstream service is unhealthy.

- **States**: Closed (normal) -> Open (fail fast) -> Half-Open (probe recovery)
- **Default config**: `threshold: 5` consecutive failures, `halfOpenAfter: 30000ms`
- **Error mapping**: `BrokenCircuitError` -> `ConnectError(Code.Unavailable)`

#### 2. Timeout

Prevents resource exhaustion from slow/hanging requests.

- **Strategy**: `TimeoutStrategy.Aggressive` -- cancel immediately on timeout
- **Default config**: `duration: 30000ms`
- **Error mapping**: `TaskCancelledError` -> `ConnectError(Code.DeadlineExceeded)`

#### 3. Bulkhead

Isolates failures by limiting concurrent requests.

- **Default config**: `capacity: 10`, `queueSize: 10`
- **Error mapping**: `BulkheadRejectedError` -> `ConnectError(Code.ResourceExhausted)`

#### 4. Fallback

Graceful degradation when primary service fails. User provides a handler function that returns cached/default data on error.

#### 5. Retry

Recovers from transient failures. **Only retries `ResourceExhausted` errors (Code 8)** -- all other error types are not retried because they are either permanent (InvalidArgument, NotFound) or handled by other patterns (Unavailable by circuit breaker, DeadlineExceeded by timeout).

- **Default config**: `maxRetries: 5`, `timeout: 1000ms` (fixed delay)

### Interceptor Chain Order

```
Request
  |
[Validation] --(invalid)--> Reject (400 Invalid Argument)
  | (valid)
[Timeout] --(timeout)--> Reject (504 Deadline Exceeded)
  | (in time)
[Circuit Breaker] --(open)--> Reject (503 Unavailable)
  | (closed)
[Bulkhead] --(exhausted)--> Reject (503 Resource Exhausted)
  | (available)
[Security/Redact]
  |
[Error Handler]
  |
[Observability]
  |
[Retry] --(ResourceExhausted)--> Wait -> Retry
  | (success)
Response
```

**Why this order?**

1. Validation first -- reject invalid data immediately
2. Timeout before Circuit Breaker -- catch slow requests before tracking failures
3. Circuit Breaker before Bulkhead -- fail fast if service is down, don't waste capacity slots
4. Retry last -- after all protections, retry only transient failures

---

## Consequences

### Positive

1. **Fault Isolation** -- circuit breaker prevents cascading failures; bulkhead isolates slow services
2. **Resource Protection** -- timeout prevents hanging requests; bulkhead prevents thread/memory exhaustion
3. **Graceful Degradation** -- fallback provides degraded service instead of complete failure
4. **Self-Healing** -- circuit breaker auto-recovers via half-open state; retry recovers from transient failures
5. **Production-Ready** -- battle-tested cockatiel library (Microsoft VSCode, Azure SDK)
6. **Embedded Device Friendly** -- lightweight (~10KB), minimal CPU/memory overhead, zero dependencies

### Negative

1. **Configuration Complexity** -- requires correct threshold tuning; incorrect config can reduce availability. Mitigated by sensible defaults.
2. **Debugging Complexity** -- circuit breaker errors can obscure root cause; fallback can hide production issues. Mitigated by comprehensive logging of state changes.
3. **Testing Complexity** -- requires chaos testing (fault injection, latency injection). Mitigated by comprehensive test suite.
4. **Latency Overhead** -- interceptor chain adds ~1-2ms per request. Acceptable for embedded devices (target p95 < 100ms).
5. **Retry Amplification Risk** -- retry can amplify load on failing services. Mitigated by only retrying ResourceExhausted errors.

---

## Alternatives Considered

### Seriously Evaluated

| # | Alternative | Rating | Why Rejected |
|---|-------------|--------|--------------|
| 1 | Manual implementation | 2/5 | High dev/maintenance cost, missing advanced features (half-open, state listeners), reinventing the wheel |
| 2 | opossum (Red Hat) | 3.5/5 | Only circuit breaker -- missing timeout, bulkhead, retry, fallback; requires combining multiple libraries; larger bundle (~20KB) |
| **-** | **cockatiel (chosen)** | **5/5** | **All patterns in one library, TypeScript-first, lightweight, Microsoft-backed** |

### Also Evaluated (not viable)

- **Hystrix (Netflix)** -- deprecated since 2018, no TypeScript implementation, too heavy for embedded devices
- **Polly-js** -- unmaintained (last commit 2019), no TypeScript types, missing bulkhead pattern

---

## References

- [cockatiel](https://github.com/connor4312/cockatiel) -- resilience library (used in Microsoft VSCode, Azure SDK)
- [Circuit Breaker Pattern](https://martinfowler.com/bliki/CircuitBreaker.html) -- Martin Fowler
- [Azure Resilience Patterns](https://learn.microsoft.com/en-us/azure/architecture/patterns/category/resiliency)
- [ADR-005: Input Validation Strategy](./005-input-validation-strategy.md)
- ADR-010: Framework vs Infrastructure (internal planning document)

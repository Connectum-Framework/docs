# ADR-008: Performance Benchmarking

## Status

**Accepted** - 2025-12-24

---

## Context

### Target Environment

**Embedded devices with resource constraints**:
- Limited CPU (1-4 cores, embedded ARM/x86)
- Limited memory (512MB - 2GB RAM)
- Long-running processes (months/years without restart)
- No cloud scaling (fixed hardware capacity)

### Why Performance Benchmarking is Critical

1. **No Cloud Scaling** -- embedded devices have fixed hardware; can't add more servers
2. **Resource Constraints** -- limited CPU/memory requires efficient code
3. **Long-Running Processes** -- performance issues compound over time (memory leaks, CPU spikes)
4. **Real-Time Requirements** -- industrial systems require low latency (< 100ms)
5. **Regression Detection** -- need a baseline for detecting performance degradation
6. **Capacity Planning** -- must understand limits for production deployment

| Metric | Target | Priority |
|--------|--------|----------|
| **p95 Latency** | **< 100ms** | **P0 (Primary SLA)** |
| p50 Latency | < 50ms | P0 |
| p99 Latency | < 150ms | P0 |
| Throughput | > 1000 req/sec | P0 |
| Memory (RSS) | < 100MB | P1 |
| CPU Usage | < 50% single core | P1 |
| Interceptor Overhead | < 2ms/interceptor | P1 |

---

## Decision

**Use [k6](https://k6.io/) load testing tool for comprehensive performance benchmarking of Connectum, with infrastructure for measuring baseline performance, interceptor overhead, and breaking points.**

### Why k6?

1. **Production-ready** -- industry standard (Grafana Labs)
2. **JavaScript syntax** -- familiar to the team
3. **Powerful scenarios** -- ramp-up, sustained load, spike tests
4. **Built-in thresholds** -- automated SLA pass/fail validation
5. **Rich metrics** -- p50, p95, p99, custom metrics
6. **Export options** -- JSON, Prometheus, InfluxDB, Grafana Cloud
7. **Lightweight** -- ~40MB binary (suitable for embedded device testing)
8. **CI/CD ready** -- exit codes for automated validation

### Performance SLA

**Primary SLA: p95 Latency < 100ms**

| Percentile | Target | Description |
|------------|--------|-------------|
| p50 | < 50ms | Fast majority |
| p95 | < 100ms | **Primary SLA** |
| p99 | < 150ms | Acceptable tail latency |
| max | < 500ms | Worst case |

**Secondary SLAs**: throughput > 1000 req/sec sustained, error rate < 1% under normal load (< 5% under stress), memory < 100MB, per-interceptor overhead < 2ms (full chain < 20ms).

### 5-Server Benchmarking Architecture

Measures interceptor overhead by comparing different configurations:

| Port | Configuration | Purpose |
|------|--------------|---------|
| 8081 | Baseline (no interceptors) | Minimum latency reference |
| 8082 | Validation only | Validation overhead |
| 8083 | Logger only | Logger overhead |
| 8084 | Tracing only | Tracing overhead |
| 8080 | Full chain (all interceptors) | Total overhead |

**Overhead = Configuration latency - Baseline latency**

### Benchmark Scenarios

#### 1. Basic Load Test (Primary SLA Validation)

```javascript
export const options = {
  stages: [
    { duration: '30s', target: 50 },   // Warm-up
    { duration: '1m', target: 100 },   // Ramp-up
    { duration: '5m', target: 100 },   // Sustained load
    { duration: '30s', target: 0 },    // Ramp-down
  ],
  thresholds: {
    http_req_duration: ['p(95)<100', 'p(99)<150'],
    http_reqs: ['rate>1000'],
    http_req_failed: ['rate<0.01'],
  },
};
```

#### 2. Stress Test (Find Breaking Point)

Ramps from 100 to 2000 VUs. Identifies maximum throughput before errors increase, latency degradation curve, and breaking point.

```javascript
thresholds: {
  http_req_duration: ['p(95)<500'],
  http_req_failed: ['rate<0.05'],
}
```

#### 3. Spike Test (Recovery Validation)

Sudden 10x load spike (100 -> 1000 VUs). Validates the system handles spikes without crashing, circuit breaker doesn't trip incorrectly, and recovery time < 30s.

#### 4. Interceptor Overhead Profiling

Low VU count (10) for measurement accuracy, tests all 5 server configurations. Validates < 2ms per interceptor target.

### Running Benchmarks

```bash
# 1. Start performance test server
node examples/performance-test-server/src/index.ts

# 2. Run scenarios
k6 run tests/performance/scenarios/basic-load.js
k6 run tests/performance/scenarios/stress-test.js
k6 run tests/performance/scenarios/spike-test.js
k6 run tests/performance/scenarios/interceptor-overhead.js

# 3. Export results
k6 run --out json=results/basic-load.json tests/performance/scenarios/basic-load.js
```

---

## Consequences

### Positive

1. **SLA Validation** -- automated verification of p95 < 100ms with pass/fail criteria for CI/CD
2. **Performance Visibility** -- exact latency distribution, throughput limits, breaking points, per-interceptor costs
3. **Capacity Planning** -- understand system limits for production deployment on fixed hardware
4. **Optimization Targets** -- identify bottlenecks, measure optimization impact, prioritize work
5. **CI/CD Integration** -- automated benchmarks, block releases on SLA violations, track trends
6. **Embedded Device Validation** -- k6 runs on embedded devices (~40MB binary)

### Negative

1. **Initial Setup Overhead** -- creating scenarios and 5-server infrastructure takes time. Mitigated: infrastructure already created.
2. **Benchmark Maintenance** -- scenarios must be updated on API changes; baselines re-established on major changes. Mitigated: versioned baselines per release.
3. **False Positives** -- network jitter and system load can skew localhost results. Mitigated: multiple runs, warm-up periods, outlier detection.
4. **Limited Real-World Simulation** -- synthetic load differs from real user behavior. Mitigated: combine with production monitoring and real device testing.

---

## Alternatives Considered

| # | Alternative | Rating | Why Rejected |
|---|-------------|--------|--------------|
| 1 | Apache Bench (ab) | 2/5 | No scenarios, no ramp-up, no p95/p99, no thresholds, HTTP/1.1 only |
| 2 | wrk/wrk2 | 3/5 | Lua syntax (less familiar), no built-in scenarios or thresholds, limited export |
| 3 | Gatling | 3/5 | JVM required (~200MB), Scala DSL, too heavy for embedded devices |
| 4 | Locust | 3.5/5 | Python runtime required, slower than k6, no built-in thresholds |
| **-** | **k6 (chosen)** | **5/5** | **JavaScript syntax, rich scenarios, built-in thresholds, lightweight, CI/CD ready** |

---

## Implementation Results

**Infrastructure: complete**. 5-server architecture, 4 benchmark scenarios, documentation.

**Baseline benchmarks: pending** (to be executed in v0.2.0-beta.1).

| Scenario | Key Metric | Target | Status |
|----------|-----------|--------|--------|
| Basic Load | p95 latency | < 100ms | Pending |
| Basic Load | Throughput | > 1000 req/sec | Pending |
| Stress Test | Breaking point | > 2000 VUs | Pending |
| Spike Test | Recovery time | < 30s | Pending |
| Interceptor Overhead | Per-interceptor | < 2ms | Pending |

---

## References

- [k6 Documentation](https://k6.io/docs/) -- load testing types, thresholds, metrics
- [SRE Book: SLOs](https://sre.google/sre-book/service-level-objectives/) -- service level objectives
- [ADR-006: Resilience Pattern Implementation](./006-resilience-pattern-implementation.md)
- [ADR-007: Testing Strategy](./007-testing-strategy.md)

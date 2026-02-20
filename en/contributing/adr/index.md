---
title: Architecture Decision Records
description: Index of all accepted Architecture Decision Records (ADRs) for the Connectum framework.
---

# Architecture Decision Records

Architecture Decision Records (ADRs) capture important design decisions with their context, rationale, and consequences. Each ADR follows a standard format: Status, Context, Decision, Consequences, Alternatives.

## Accepted ADRs

| # | Title | Date | Summary |
|---|-------|------|---------|
| 001 | [Native TypeScript](/en/contributing/adr/001-native-typescript-migration) | 2026-02-16 | Native TypeScript development + compile-before-publish with tsup |
| 003 | [Package Decomposition](/en/contributing/adr/003-package-decomposition) | 2025-12-22 | Modular packages in dependency layers |
| 005 | [Input Validation](/en/contributing/adr/005-input-validation-strategy) | 2025-12-24 | Protovalidate as primary validation mechanism |
| 006 | [Resilience Patterns](/en/contributing/adr/006-resilience-pattern-implementation) | 2025-12-24 | Resilience interceptors with cockatiel library |
| 007 | [Testing Strategy](/en/contributing/adr/007-testing-strategy) | 2025-12-24 | node:test runner, 90%+ coverage target |
| 008 | [Performance Benchmarking](/en/contributing/adr/008-performance-benchmarking) | 2025-12-24 | k6 load testing, p95 < 100ms SLA |
| 009 | [Buf CLI Migration](/en/contributing/adr/009-buf-cli-migration) | 2026-02-06 | Buf CLI v2 for proto generation + lint |
| 014 | [Method Filter Interceptor](/en/contributing/adr/014-method-filter-interceptor) | 2026-02-07 | Per-method interceptor routing with wildcards |
| 020 | [Reflection Proto Sync](/en/contributing/adr/020-reflection-proto-sync) | 2026-02-07 | 4-phase reflection-based proto synchronization |
| 022 | [Protocol Extraction](/en/contributing/adr/022-protocol-extraction) | 2026-02-11 | Healthcheck/Reflection as separate packages |
| 023 | [Uniform Registration API](/en/contributing/adr/023-uniform-registration-api) | 2026-02-11 | createDefaultInterceptors(), explicit interceptor control |
| 024 | [Auth/Authz Strategy](/en/contributing/adr/024-auth-authz-strategy) | 2026-02-15 | @connectum/auth package with JWT, RBAC, context propagation |
| 025 | [Package Versioning Strategy](/en/contributing/adr/025-package-versioning-strategy) | 2026-02-20 | Two-phase versioning: Fixed for rc, Hybrid after 1.0.0 stable |

## Creating a New ADR

1. Create `XXX-title.md` using the template below
2. Status starts as **Proposed**
3. After review and approval, change to **Accepted**
4. Update this index

```markdown
# ADR-XXX: Title

## Status
Proposed -- YYYY-MM-DD

## Context
Why is this decision needed?

## Decision
What did we decide?

## Consequences
### Positive
### Negative

## Alternatives Considered
```

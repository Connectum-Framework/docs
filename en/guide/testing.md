---
outline: deep
---

# Testing

Scenario-based API testing with YAML runbooks -- validate gRPC and ConnectRPC services end-to-end.

## Quick Start

Install [runn](https://github.com/k1LoW/runn) and create `tests/grpc-greeter.yml`:

```yaml
desc: Greeter service -- gRPC
runners:
  greq: grpc://localhost:5000
steps:
  say_hello:
    greq:
      greeter.v1.GreeterService/SayHello:
        message:
          name: Alice
    test: |
      current.res.status == 0 &&
      current.res.message.message == 'Hello, Alice!'
```

```bash
runn run tests/grpc-greeter.yml
```

::: info Working Example
See [examples/runn](https://github.com/Connectum-Framework/examples/tree/main/runn) for a complete Docker-based E2E test suite with 9 runbooks covering healthcheck, reflection, auth, interceptors, timeout, and multi-service scenarios.
:::

## Key Concepts

| Tool | Strengths |
|------|-----------|
| **runn** (recommended) | gRPC reflection support, HTTP testing, expr-lang assertions, single binary, Docker image |
| **scenarigo** | Go plugin system, JUnit XML reports, template-based assertions |

Both tools use YAML to define multi-step test scenarios. Scenario-based testing catches integration issues that unit tests miss: serialization, validation, interceptor chains, and health check endpoints.

## Learn More

- [runn](/en/guide/testing/runn) -- gRPC/HTTP testing, streaming, TLS, CI/CD integration
- [scenarigo](/en/guide/testing/scenarigo) -- alternative tool with Go plugins and JUnit reports

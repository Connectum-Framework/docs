---
title: API Testing
description: Scenario-based API testing for Connectum services with runn and scenarigo.
outline: deep
---

# API Testing

Scenario-based testing validates your gRPC and ConnectRPC services end-to-end using YAML runbooks. This approach catches integration issues that unit tests miss: serialization, validation constraints, interceptor chains, and health check endpoints.

## runn (Recommended) {#runn}

[runn](https://github.com/k1LoW/runn) is a scenario-based testing tool that supports gRPC, HTTP/REST, databases, and more. It uses YAML runbooks to define multi-step test scenarios with assertions.

**Why runn for Connectum:**

- gRPC testing with **server reflection** (no proto files needed)
- HTTP testing for ConnectRPC endpoints
- Built-in assertion engine ([expr-lang](https://expr-lang.org/docs/language-definition))
- Single binary, CI-friendly
- Docker image available

::: info Working Example
See [examples/runn](https://github.com/Connectum-Framework/examples/tree/main/runn) for a complete Docker-based E2E test suite with 9 runbooks covering healthcheck, reflection, auth, interceptors, timeout, and multi-service scenarios.
:::

### Installation

::: code-group

```bash [Homebrew]
brew install k1LoW/tap/runn
```

```bash [Go]
go install github.com/k1LoW/runn/cmd/runn@latest
```

```bash [Aqua]
aqua g -i k1LoW/runn
```

```bash [Docker]
docker pull ghcr.io/k1low/runn:latest
```

:::

### Testing gRPC Services

Connectum services expose gRPC endpoints. Server reflection can be enabled via `Reflection()` protocol. runn can discover services automatically without proto files.

Create `tests/grpc-greeter.yml`:

```yaml
desc: Greeter service — gRPC
runners:
  greq: grpc://localhost:5000
steps:
  say_hello:
    desc: SayHello returns greeting
    greq:
      greeter.v1.GreeterService/SayHello:
        message:
          name: Alice
    test: |
      current.res.status == 0 &&
      current.res.message.message == 'Hello, Alice!'
```

Run it:

```bash
runn run tests/grpc-greeter.yml
```

::: tip Server Reflection
When Server Reflection is enabled via `protocols: [Reflection()]`, runn discovers services automatically. No `protos:` or `importPaths:` configuration needed.
:::

#### With Proto Files

If reflection is disabled, point runn to your proto definitions:

```yaml
runners:
  greq:
    addr: localhost:5000
    importPaths:
      - proto
    protos:
      - greeter.proto
```

#### gRPC Metadata

Pass metadata (headers) with requests:

```yaml
steps:
  with_metadata:
    greq:
      greeter.v1.GreeterService/SayHello:
        headers:
          authorization: "Bearer my-token"
          x-request-id: "test-123"
        message:
          name: Bob
    test: current.res.status == 0
```

### Testing ConnectRPC HTTP Endpoints

Connectum services also accept HTTP/1.1 requests via the ConnectRPC protocol.

Create `tests/http-greeter.yml`:

```yaml
desc: Greeter service — ConnectRPC HTTP
runners:
  req: http://localhost:5000
steps:
  say_hello:
    desc: SayHello via HTTP POST
    req:
      /greeter.v1.GreeterService/SayHello:
        post:
          header:
            Content-Type: application/json
          body:
            application/json:
              name: Bob
    test: |
      current.res.status == 200 &&
      current.res.body.message == 'Hello, Bob!'
```

### Testing Health Checks

Connectum exposes both gRPC and HTTP health check endpoints.

Create `tests/health.yml`:

```yaml
desc: Health check endpoints
runners:
  greq: grpc://localhost:5000
  req: http://localhost:5000
steps:
  grpc_health:
    desc: gRPC Health Check
    greq:
      grpc.health.v1.Health/Check:
        message: {}
    test: |
      current.res.status == 0 &&
      current.res.message.status == 1

  http_health:
    desc: HTTP /healthz
    req:
      /healthz:
        get:
          header:
            Accept: application/json
    test: current.res.status == 200
```

### Validation Testing

Test that [protovalidate](/en/guide/interceptors) constraints reject invalid input:

```yaml
desc: Validation rejects empty name
runners:
  greq: grpc://localhost:5000
steps:
  empty_name:
    desc: SayHello with empty name returns INVALID_ARGUMENT
    greq:
      greeter.v1.GreeterService/SayHello:
        message:
          name: ""
    test: current.res.status == 3
```

gRPC status code `3` = `INVALID_ARGUMENT`.

### Multi-Step Scenarios

Chain steps together using variable references:

```yaml
desc: Multi-step gRPC scenario
runners:
  greq: grpc://localhost:5000
vars:
  username: Charlie
steps:
  greet:
    desc: Greet user
    greq:
      greeter.v1.GreeterService/SayHello:
        message:
          name: "{{ vars.username }}"
    test: current.res.status == 0

  verify_message:
    desc: Verify greeting format
    test: |
      steps.greet.res.message.message == 'Hello, Charlie!'
```

### Using Variables and Environment

```yaml
desc: Environment-driven tests
vars:
  host: ${GRPC_HOST:-localhost:5000}
  token: ${AUTH_TOKEN}
runners:
  greq: "grpc://{{ vars.host }}"
steps:
  authenticated_call:
    greq:
      myapp.v1.MyService/GetData:
        headers:
          authorization: "Bearer {{ vars.token }}"
        message: {}
    test: current.res.status == 0
```

### Streaming RPCs

Test server-streaming responses:

```yaml
steps:
  server_stream:
    greq:
      myapp.v1.MyService/ListItems:
        message:
          limit: 10
    test: |
      current.res.status == 0 &&
      len(current.res.messages) > 0
```

For client-streaming, send multiple messages:

```yaml
steps:
  client_stream:
    greq:
      myapp.v1.MyService/SendBatch:
        messages:
          - data: "item-1"
          - data: "item-2"
          - data: "item-3"
    test: current.res.status == 0
```

### TLS / mTLS

```yaml
runners:
  greq:
    addr: grpc.example.com:443
    tls: true
    cacert: certs/ca.pem
    cert: certs/client.pem
    key: certs/client-key.pem
```

### CI/CD Integration

#### GitHub Actions

```yaml
jobs:
  api-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Install runn
        run: |
          brew install k1LoW/tap/runn

      - name: Start service
        run: node src/index.ts &

      - name: Wait for service
        run: |
          for i in $(seq 1 30); do
            curl -sf http://localhost:5000/healthz && break
            sleep 1
          done

      - name: Run API tests
        run: runn run tests/**/*.yml
```

#### Docker Compose

```yaml
services:
  app:
    build: .
    ports:
      - "5000:5000"

  api-tests:
    image: ghcr.io/k1low/runn:latest
    depends_on:
      app:
        condition: service_healthy
    volumes:
      - ./tests:/books
    command: run /books/**/*.yml
```

### CLI Reference

```bash
# Run all test scenarios
runn run tests/**/*.yml

# Run with verbose output
runn run --verbose tests/grpc-greeter.yml

# List available scenarios
runn list tests/**/*.yml

# Generate a runbook from a command
runn new -- grpcurl -plaintext localhost:5000 greeter.v1.GreeterService/SayHello
```

## scenarigo (Alternative) {#scenarigo}

[scenarigo](https://github.com/scenarigo/scenarigo) is another scenario-based API testing tool with gRPC and HTTP support. It offers a Go plugin system and JUnit XML report generation.

### Installation

```bash
go install github.com/scenarigo/scenarigo/cmd/scenarigo@latest
```

### Example: gRPC Test

```yaml
title: Greeter gRPC test
steps:
  - title: SayHello
    protocol: grpc
    request:
      method: greeter.v1.GreeterService/SayHello
      body:
        name: Alice
    expect:
      code: OK
      body:
        message: "Hello, Alice!"
```

### Example: HTTP Test

```yaml
title: Greeter HTTP test
steps:
  - title: SayHello via ConnectRPC
    protocol: http
    request:
      method: POST
      url: "http://localhost:5000/greeter.v1.GreeterService/SayHello"
      header:
        Content-Type: application/json
      body:
        name: Bob
    expect:
      code: OK
      body:
        message: "Hello, Bob!"
```

### Key Differences

| Feature | runn | scenarigo |
|---------|------|-----------|
| **Installation** | Single binary (brew, aqua, Docker) | Go install or binary |
| **gRPC reflection** | Built-in | Requires proto files |
| **Assertions** | expr-lang expressions | Template-based + assert functions |
| **Streaming** | Client + server streaming | Limited |
| **Plugin system** | No | Go plugins |
| **Reports** | Text output | JUnit XML, JSON |
| **Docker** | Official image | No |
| **Database testing** | Built-in | Via plugins |

## Recommended Test Structure

```
tests/
├── api/
│   ├── grpc-greeter.yml       # gRPC endpoint tests
│   ├── http-greeter.yml       # ConnectRPC HTTP tests
│   ├── health.yml             # Health check tests
│   └── validation.yml         # Validation constraint tests
└── scenarios/
    ├── user-flow.yml          # Multi-step user scenarios
    └── error-handling.yml     # Error response tests
```

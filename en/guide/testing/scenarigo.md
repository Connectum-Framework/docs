---
outline: deep
---

# scenarigo

[scenarigo](https://github.com/scenarigo/scenarigo) is a scenario-based API testing tool with gRPC and HTTP support. It offers a Go plugin system and JUnit XML report generation.

## Installation

```bash
go install github.com/scenarigo/scenarigo/cmd/scenarigo@latest
```

## Example: gRPC Test

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

## Example: HTTP Test

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

## Key Differences: runn vs scenarigo

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

## Related

- [Testing Overview](/en/guide/testing) -- back to overview
- [runn](/en/guide/testing/runn) -- recommended testing tool with gRPC reflection support

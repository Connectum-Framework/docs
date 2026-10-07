---
title: Test Connectum Services with scenarigo
description: Write gRPC and HTTP API scenarios with scenarigo.
docType: how-to
outline: deep
---

# scenarigo

[scenarigo](https://github.com/scenarigo/scenarigo) is a scenario-based API testing tool with gRPC and HTTP support. It offers a Go plugin system and JUnit XML report generation.

## Installation

```bash
go install github.com/scenarigo/scenarigo/cmd/scenarigo@latest
```

## Example: gRPC Test

Start the Greeter service with `allowHTTP1: false` and `Reflection()`. This
scenario follows the [upstream gRPC configuration](https://github.com/scenarigo/scenarigo#grpc-testing)
and uses reflection rather than a Go client plugin.

```yaml
title: Greeter gRPC test
steps:
  - title: SayHello
    protocol: grpc
    request:
      target: localhost:5000
      service: greeter.v1.GreeterService
      method: SayHello
      message:
        name: Alice
      options:
        reflection:
          enabled: true
        auth:
          insecure: true
    expect:
      status:
        code: OK
      message:
        message: "Hello, Alice!"
```

## Example: HTTP Test

For this plaintext HTTP/1.1 scenario, restart the server with `allowHTTP1: true`.

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
| **gRPC reflection** | Built-in | Supported with `options.reflection.enabled` |
| **Assertions** | expr-lang expressions | Template-based + assert functions |
| **Streaming** | Client + server streaming | Limited |
| **Plugin system** | No | Go plugins |
| **Reports** | Text output | JUnit XML, JSON |
| **Docker** | Official image | No |
| **Database testing** | Built-in | Via plugins |

Save either scenario as `tests/greeter.yaml`, then initialize the tool's config
and run it:

```bash
scenarigo config init
scenarigo run tests/greeter.yaml
```

For the Quickstart name constraint, add this step to the gRPC scenario. Its
non-OK status uses the numeric gRPC code:

```yaml
  - title: Reject empty name
    protocol: grpc
    request:
      target: localhost:5000
      service: greeter.v1.GreeterService
      method: SayHello
      message:
        name: ""
      options:
        reflection:
          enabled: true
        auth:
          insecure: true
    expect:
      status:
        code: 3
        message: "name: must be at least 1 characters [string.min_len]"
```

## Related

- [Testing Overview](/en/guide/testing) -- back to overview
- [runn](/en/guide/testing/runn) -- recommended testing tool with gRPC reflection support

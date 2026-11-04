---
title: End-to-end tests
description: Verify the running service through real protocols, credentials and deployment configuration.
docType: how-to
---

# End-to-end tests

Start the real application with its generated contract and required dependencies,
then call its exposed endpoints. These tests cover what local tests cannot:
listener mode, serialization, credentials, proxy routing and deployment probes.

1. Generate protobuf code and start the application's normal process entry.
2. Wait for readiness rather than sleeping for a fixed delay.
3. Make one successful request and assert its actual response.
4. Check missing/invalid credentials, validation failures and the failure paths
   that matter at this boundary.
5. Stop the process and its test dependencies, even if an assertion fails.

Use [runn](/en/guide/testing/runn) for protocol scenarios in runbooks, or
[scenarigo](/en/guide/testing/scenarigo) when the suite needs its Go plugins and
JUnit-oriented output. Both belong here; neither replaces unit tests for every
business-rule case.

Plaintext gRPC needs the HTTP/2 listener; a plaintext HTTP/1.1 Connect scenario
uses a different listener mode. Select the matching configuration from the
[transport matrix](/en/guide/production/transport-matrix).

## Executable examples

- [hris tests](https://github.com/Connectum-Framework/examples/tree/main/hris/tests)
  exercise a complete in-process application with an in-memory EventBus and
  PGlite. They establish that topology's application integration, not a broker
  or network deployment boundary.
- The `with-events-*` examples exercise their services and broker through
  `docker compose`; see [the examples repository](https://github.com/Connectum-Framework/examples).

Keep fast decision tests in [Unit tests](/en/guide/testing/unit), and test
registration and middleware in [Integration tests](/en/guide/testing/integration).

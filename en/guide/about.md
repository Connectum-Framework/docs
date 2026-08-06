---
title: What Is Connectum?
description: A concise mental model for the Connectum framework and where to begin.
docType: concept
outline: deep
---

# What Is Connectum?

Connectum is a modular framework for gRPC and ConnectRPC microservices on
Node.js. It standardizes the service runtime—registration, lifecycle,
middleware, protocols, and shutdown—while keeping security, communication,
observability, and broker integrations explicit.

The framework is for teams that want consistent production behavior across
services without adopting an application platform that hides transport and
middleware decisions.

## Mental Model

Every service begins with three things:

1. **A proto contract** defines messages and RPC methods.
2. **A service implementation** connects generated descriptors to typed handlers.
3. **`createServer()`** composes services, protocols, interceptors, and lifecycle policy.

Capabilities are modules around that core:

- Interceptors protect the request path with error handling, validation, and
  explicitly enabled resilience.
- Auth modules establish identity and authorization context.
- The service catalog and EventBus connect services synchronously or asynchronously.
- Health, reflection, and OpenTelemetry make services inspectable and operable.

## What Connectum Owns

| Concern | Connectum responsibility |
|---|---|
| Service runtime | Server creation, registration, lifecycle events, shutdown, TLS |
| Request pipeline | Ordered ConnectRPC interceptors and method filtering |
| Contracts | Proto-first validation and generated service/catalog types |
| Communication | Typed service catalog calls and pluggable event brokers |
| Security | Authentication, authorization, context propagation, TLS/mTLS |
| Operations | Health/readiness, reflection, traces, metrics, and logs |
| Tooling | Scaffolding, service generation, contract sync, and test utilities |

Connectum does not provide an ORM, frontend framework, or CommonJS build. Public
packages ship compiled ESM for Node.js `>=22.13.0`; direct TypeScript execution
requirements are documented in [Runtime Compatibility](/en/guide/runtime-compatibility).

## Choose Your Path {#choose-your-path}

- New service: [Build Your First Connectum Service](/en/guide/quickstart)
- Server behavior: [Server](/en/guide/server)
- Validation and middleware: [Interceptors](/en/guide/interceptors)
- Service-to-service design: [Choosing a Communication Mechanism](/en/guide/service-communication/choosing-a-mechanism)
- Authentication and authorization: [Auth and Authz](/en/guide/auth)
- Production signals: [Observability](/en/guide/observability)
- Deployment: [Docker](/en/guide/production/docker) or [Kubernetes](/en/guide/production/kubernetes)
- Exact interfaces: [API and Reference](/en/reference/)

## Architecture and Boundaries {#architecture-overview}

Package dependency layers prevent capability modules from becoming an implicit
monolith. They are an implementation constraint, not the primary way readers
choose packages. See [Connectum Runtime Architecture](/en/guide/production/architecture)
for the process boundary and extension seams, and the [ADR index](/en/contributing/adr/)
for package-decomposition rationale.

## Non-Goals

- Managing application databases or domain models
- Replacing deployment platforms or service meshes
- Hiding transport, auth, or resilience policy behind implicit defaults
- Supporting CommonJS or legacy Node.js runtimes

## External Resources

- [ConnectRPC documentation](https://connectrpc.com/docs)
- [OpenTelemetry for JavaScript](https://opentelemetry.io/docs/languages/js/)
- [gRPC health checking protocol](https://github.com/grpc/grpc/blob/master/doc/health-checking.md)
- [Protovalidate](https://github.com/bufbuild/protovalidate)

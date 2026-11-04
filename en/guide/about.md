---
title: Get started
description: A concise mental model for the Connectum framework and where to begin.
docType: concept
outline: deep
---

# Get started {#what-is-connectum}

<script setup>
import ModuleGrid from '../../.vitepress/theme/components/ModuleGrid.vue';
import TechnologyStack from '../../.vitepress/theme/components/TechnologyStack.vue';
</script>

Connectum builds on ConnectRPC to give TypeScript services a common
way to start, stop and connect request middleware. Your API stays in Protobuf;
handlers use the generated types.

Use it when you want shared service conventions instead of assembling lifecycle,
middleware and service-call wiring separately for each application.
Direct ConnectRPC can be enough for a small endpoint or an application whose
existing setup already meets those needs. Connectum is not required just to get
typed Protobuf RPCs.

## Mental Model

<TechnologyStack />

Start with [one protected RPC](/en/guide/quickstart), from a small contract to
an authenticated response. The [manual tutorial](/en/guide/quickstart-manual)
also explains the server foundation without the CLI.

## What Connectum Owns

ConnectRPC supplies the RPC layer; protobuf-es supplies generated message and
service types; Protovalidate supplies constraint validation. Connectum adds a
shared server lifecycle, explicit module composition and typed catalog calls.
Runtime checks depend on the middleware and configuration you actually connect.
See [Guarantees and limits](/en/guide/guarantees) for prerequisites,
enforcement layers, limitations and source/test evidence.

Connectum does not provide an ORM, frontend framework, or CommonJS build. Public
packages ship compiled ESM for Node.js `>=22.13.0`; direct TypeScript execution
requirements are documented in [Runtime Compatibility](/en/guide/runtime-compatibility).

## Choose Your Path {#choose-your-path}

- New service: [Build Your First Connectum Service](/en/guide/quickstart)
- Application composition: [Build a service](/en/guide/build-a-service)
- Calls, local transports and events: [Communication](/en/guide/communication)
- Unit, integration and deployed scenarios: [Testing](/en/guide/testing)
- Identity, permissions and TLS: [Secure services](/en/guide/secure-services)
- Production signals and probes: [Observe and operate](/en/guide/observe-and-operate)
- Containers, orchestration and gateways: [Deploy](/en/guide/deploy)
- Runtime boundaries and extensions: [Advanced](/en/guide/advanced)
- Exact interfaces: [Generated API](/en/api/)

## Architecture and Boundaries {#architecture-overview}

See [Connectum Runtime Architecture](/en/guide/production/architecture) for process
boundaries and extension points. The [ADR index](/en/contributing/adr/) records
design decisions, including why capabilities remain separate modules.

## Non-Goals

::: details What stays outside the framework
- Managing application databases or domain models
- Replacing deployment platforms or service meshes
- Hiding transport, auth, or resilience policy behind implicit defaults
- Supporting CommonJS or legacy Node.js runtimes
:::

## External Resources

- [ConnectRPC documentation](https://connectrpc.com/docs)
- [OpenTelemetry for JavaScript](https://opentelemetry.io/docs/languages/js/)
- [gRPC health checking protocol](https://github.com/grpc/grpc/blob/master/doc/health-checking.md)
- [Protovalidate](https://github.com/bufbuild/protovalidate)

## Find a module {#modules}

Each module has a Guide for its usage and a generated API for exact symbols.
Installation and behavior live with the Guide that owns that capability.

::: details Browse modules by capability
<ModuleGrid />
:::

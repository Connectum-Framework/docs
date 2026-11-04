---
title: Guarantees and limits
description: Prerequisites, owners, evidence and limits for Connectum 1.3 contract and runtime guarantees.
docType: reference
outline: deep
---

# Guarantees and limits

For a first working RPC, start with the [Quickstart](/en/guide/quickstart).
This reference separates generated types, configured runtime enforcement and
application responsibilities; it is not a setup checklist.

::: info Version scope
This matrix targets the 1.3 source contract. Source and test links are pinned to
[framework revision f145616](https://github.com/Connectum-Framework/connectum/tree/f1456162e51a1f225f8f0d8c2fb7653eb1181aca);
they do not establish npm release availability or certify a deployment.
Compare installed versions with the [migration guidance](/en/migration/service-catalog).
Regenerate existing catalogs after upgrading the plugin to obtain its updated request types.
:::

## Contract and runtime matrix

| What is provided | Layer and owner | Required setup | Observable result and limit | Evidence |
|---|---|---|---|---|
| Typed catalog calls | Compile time: Connectum catalog plugin using protobuf-es types | Generate and import the catalog augmentation; run TypeScript checking. | Unknown procedure keys and incompatible request initializers produce type errors in checked code. This does not validate arbitrary runtime input or business rules. | [Source][catalog-source]; [generation and consumer test][catalog-test]; [negative type cases][catalog-cases] |
| Unary request validation | Runtime: upstream `@connectrpc/validate` / Protovalidate, wired by Connectum | Declare constraints, generate their descriptors and install validation in the service's effective interceptor chain. | A constraint violation rejects with `InvalidArgument` before the unary handler runs. A `.proto` file or generated TypeScript alone does not enforce it. | [Source][validation-source]; [validation and handler-exclusion test][validation-test] |
| Startup failure cleanup | Runtime: Connectum core | Use `server.start()` and handle its rejected promise. | A synchronously throwing `ready` listener rejects startup, releases the bound port and automatic signal listeners, and leaves the server stopped. This is process cleanup, not application rollback. | [Source][startup-source]; [port and listener cleanup test][startup-test] |
| Inherited signal and deadline for `ctx.call` | Runtime: Connectum dispatch frame and ConnectRPC transport | Configure the catalog; register a local target or configure its remote resolver. Omit overrides to inherit the inbound request context. | The downstream call receives the inbound signal and remaining timeout; a longer timeout override is clamped. A supplied signal replaces inheritance. Cancellation is cooperative, not side-effect rollback. | [Source][cascade-source]; [signal and deadline tests][cascade-test] |
| One outer outgoing interceptor chain | Runtime: Connectum core using the ConnectRPC interceptor pipeline | Configure `outgoingInterceptors` and use `ctx.call`, `ctx.stream` or `server.client()`. A standalone catalog client takes its own chain. | The chain wraps each catalog call, including local and resolver routes, outside the resolver transport's middleware. Retry inside the chain can repeat downstream execution; this is not exactly-once RPC execution. | [Local/remote wiring][outgoing-source]; [remote wrapper][outgoing-wrapper]; [route, kind and order tests][outgoing-test] |

## Configuration boundaries

- `createServer()` alone does not install validation or authentication.
  `createDefaultInterceptors()` includes error handling and validation unless
  disabled; its timeout, bulkhead, circuit breaker and retry policies are opt-in.
  See [Interceptors](/en/guide/interceptors).
- Authentication requires configured identity verification and authorization
  policy. Proto annotations alone do not establish a caller's identity.
  Add [authentication and authorization](/en/guide/auth) when the service needs them.
- Catalog typing does not configure deployment topology. Local registration and
  remote resolvers decide where calls go; no automatic credential forwarding is
  implied. See [Service catalog](/en/guide/service-communication/service-catalog).
- `server.localClient()` and `createLocalTransport()` do not inherit the server's
  outgoing chain. Configuring the same policy in both the outer chain and a
  resolver transport runs that policy in both places; the framework cannot
  deduplicate it. See [Client interceptors](/en/guide/service-communication/client-interceptors).
- Local calls still need the applicable authentication and authorization setup.
  In-process execution does not exercise TCP, TLS or every wire-serialization
  detail. Leaving a stream loop with `break` is not itself cancellation; see the
  [local transport boundary][local-boundary] and [in-process guide](/en/guide/production/in-process-transport).

## Not guaranteed

- Type checking does not prove business correctness, runtime input validity or
  compatibility with every deployed contract version.
- Cancellation does not undo committed work or forcibly stop signal-unaware code.
- Shared middleware does not make local and network calls identical in identity,
  security, serialization, latency or failure behavior.
- Connectum does not automatically provide distributed transactions,
  exactly-once execution or exactly-once event delivery.

For setup, follow [Validation](/en/guide/validation),
[Server lifecycle](/en/guide/server/lifecycle) or
[Service communication](/en/guide/service-communication).

[catalog-source]: https://github.com/Connectum-Framework/connectum/blob/f1456162e51a1f225f8f0d8c2fb7653eb1181aca/packages/protoc-gen-catalog/src/plugin.ts#L99-L128
[catalog-test]: https://github.com/Connectum-Framework/connectum/blob/f1456162e51a1f225f8f0d8c2fb7653eb1181aca/packages/protoc-gen-catalog/tests/integration/request-initializers.test.ts#L118-L146
[catalog-cases]: https://github.com/Connectum-Framework/connectum/blob/f1456162e51a1f225f8f0d8c2fb7653eb1181aca/packages/protoc-gen-catalog/tests/fixtures/request-initializers/consumer.ts.fixture#L54-L79
[validation-source]: https://github.com/Connectum-Framework/connectum/blob/f1456162e51a1f225f8f0d8c2fb7653eb1181aca/packages/interceptors/src/defaults.ts#L188-L236
[validation-test]: https://github.com/Connectum-Framework/connectum/blob/f1456162e51a1f225f8f0d8c2fb7653eb1181aca/packages/interceptors/tests/unit/defaults.test.ts#L45-L55
[startup-source]: https://github.com/Connectum-Framework/connectum/blob/f1456162e51a1f225f8f0d8c2fb7653eb1181aca/packages/core/src/Server.ts#L240-L255
[startup-test]: https://github.com/Connectum-Framework/connectum/blob/f1456162e51a1f225f8f0d8c2fb7653eb1181aca/packages/core/tests/unit/Server.listenerSafety.test.ts#L71-L89
[cascade-source]: https://github.com/Connectum-Framework/connectum/blob/f1456162e51a1f225f8f0d8c2fb7653eb1181aca/packages/core/src/catalogDispatcher.ts#L454-L505
[cascade-test]: https://github.com/Connectum-Framework/connectum/blob/f1456162e51a1f225f8f0d8c2fb7653eb1181aca/packages/core/tests/integration/ctxCall.test.ts#L213-L342
[outgoing-source]: https://github.com/Connectum-Framework/connectum/blob/f1456162e51a1f225f8f0d8c2fb7653eb1181aca/packages/core/src/Server.ts#L429-L456
[outgoing-wrapper]: https://github.com/Connectum-Framework/connectum/blob/f1456162e51a1f225f8f0d8c2fb7653eb1181aca/packages/core/src/outgoingTransport.ts#L76-L129
[outgoing-test]: https://github.com/Connectum-Framework/connectum/blob/f1456162e51a1f225f8f0d8c2fb7653eb1181aca/packages/core/tests/integration/outgoingInterceptors.test.ts#L232-L284
[local-boundary]: https://github.com/Connectum-Framework/connectum/blob/f1456162e51a1f225f8f0d8c2fb7653eb1181aca/packages/core/src/localTransport.ts#L138-L169

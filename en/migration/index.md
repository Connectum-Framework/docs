---
title: Upgrade and Migration
description: Determine whether a Connectum upgrade requires changes and follow focused migration guides.
docType: migration
---

<script setup>
import site from '../../.vitepress/data/site.json'
</script>

# Upgrade and Migration

The documentation describes the **{{ site.documentedVersion }}** release line. Check every installed
`@connectum/*` version before applying a migration; packages can use different
compatible release lines, so verify the complete set rather than inferring it from
one package.

::: code-group
```bash [npm]
npm ls '@connectum/*'
```

```bash [pnpm]
pnpm list '@connectum/*'
```

```bash [bun]
bun pm ls
```
:::

## Current Release Line

The portal may document the next release line before every package on that line is
published. Use the package-specific [GitHub releases](https://github.com/Connectum-Framework/connectum/releases)
and the [Runtime Compatibility](/en/guide/runtime-compatibility) matrix to decide
whether an upgrade applies to your installed set.

If you are upgrading from a pre-1.0 or 1.0 installation, review every applicable
action below rather than assuming a direct upgrade to the documented line.

## Required Actions by Starting Version

| Installed version | Required action |
|---|---|
| 1.2.x | Review the 1.3 release notes for each installed package and run your existing tests; if you pin `@bufbuild/protobuf` or Connect, follow [Peer dependencies on protobuf and Connect](/en/migration/peer-dependencies); if you implement your own `ProtocolRegistration`, or a `defineLazyService` factory relies on separate instances per transport, follow [Custom protocols: setup/register split](/en/migration/protocol-setup); if in-process calls (`localClient`, `ctx.call`) watch `context.signal` and must finish during `server.stop()`, follow [In-process calls on shutdown](/en/migration/in-process-shutdown); if a service with an `eventBus` relied on a message that arrives after the shutdown began still being handled by the stopping instance, follow [Event bus stops receiving at the shutdown signal](/en/migration/events-reception-on-shutdown): the bus now stops receiving when the shutdown signal aborts, and such a message is redelivered; if you use `createLoggerInterceptor` and read request or response bodies from its output, follow [Logger bodies are opt-in](/en/migration/logger-bodies): bodies are no longer logged unless you set `includeBodies: true`; if you use the timeout or retry interceptors, or rely on a late successful response or on one more retry after a timeout or a cancellation, follow [Cancellation and Streaming Scope](/en/guide/interceptors/built-in#cancellation-and-streaming-scope): an expired timeout now aborts `req.signal` and `ctx.signal` with `DeadlineExceeded`, retry stops on cancellation, and such calls end with `DeadlineExceeded` or `Canceled`; if you set `outgoingInterceptors` and also copied the same signer, tracing or retry onto your resolver's transports, follow section 6 of [Migrating to the Service Catalog](/en/migration/service-catalog): the chain now runs on every route, so remove the copy; if a bearer signer sits in `outgoingInterceptors` and the resolver also reaches targets in another trust domain, the same section applies: the signer now runs on those targets too, so restrict it by `req.service.typeName`; if you use `@connectum/events-amqp`, follow [events-amqp 1.3 behavior changes](/en/migration/events-amqp-1.3): `onDisconnected` now fires once per drop (disconnect counters drop, roughly by half), you must subscribe again after `connect()` once recovery has given up, and a finite `maxRetries` makes the initial connect reject with `AmqpConnectionError` (original error in `cause`) instead of the raw error; if your issuer mints signed tokens without an `exp` claim, follow [Signed tokens must carry `exp`](/en/migration/token-expiration): `createJwtAuthInterceptor` and `signedTokenTrust` now reject them unless you set `requireExpiration: false`; if a dashboard, alert or code uses `rpc.system`, `rpc.service`, `rpc.connect_rpc.status_code` or their constants from `@connectum/otel`, follow [RPC telemetry attribute names](/en/migration/otel-rpc-attributes): they are now `rpc.system.name`, a fully qualified `rpc.method` and `rpc.response.status_code`, and a successful span now has an unset status instead of `OK` (queries that select `status = ok` must select "status is not error"); if you pass `kafkaConfig` or a numeric `compression` to `KafkaAdapter()`, follow [Kafka adapter options](/en/migration/kafka-adapter-options): use the typed options and `clientOptions`; if a client reads the text of an error that a handler raised as a plain `Error`, a thrown string or an object with a numeric `code`, follow [Error handler keeps non-Connect messages on the server](/en/migration/error-handler-messages): the client now receives `internal error` (or an empty text when the error carries a numeric `code`) unless you set `exposeErrorMessages: true`; if you use `@connectum/auth` with a misspelled proto `policy` or `default_policy`, a method that is both `public` and `internal`, `signedTokenTrust` issuers that rely on `sub` or `scope`, `skipMethods: ['*']`, `propagateHeaders` with identities that contain line breaks or characters above U+00FF, or a cache `ttl` or `maxSize` that is not finite or below 1, follow [Auth option validation](/en/migration/auth-proto-options): each of these now fails loudly; if you pass `httpPaths` to `Healthcheck()`, follow [HTTP health options are validated](/en/migration/healthcheck-http-options): an empty list (`[]`), a non-string entry, an entry without a leading `/`, or one containing `?` or `#` now throws at startup; to turn the HTTP endpoint off set `httpEnabled: false`; if you pass a fractional number or a delay above 2147483647 ms to the timeout, bulkhead, circuit breaker or retry interceptors, `fallback: true` or `null` to `createDefaultInterceptors()`, or `fallback` to `connectum init --resilience`, follow [Interceptor option validation](/en/migration/interceptor-options): these now throw when the chain is built; if your tests use the descriptor mocks of `@connectum/test-fixtures` or `@connectum/testing` (`createMockDescMessage`, `createMockDescField`, `createMockDescMethod`, `createFakeMethod`, `createMockNextSlow`), follow [Test fixture descriptors follow protobuf-es](/en/migration/test-fixtures-descriptors): `create(mock)` now returns zeroed fields, a snake_case name gives a camelCase `localName`, and a repeated field number throws; if your code reads the request type of a regenerated service catalog (`ConnectumCallMap`, `ConnectumStreamMap`) as a full message, follow section 3 of [Migrating to the Service Catalog](/en/migration/service-catalog): the request slot is now `MessageInitShape<typeof RequestSchema>`, so take `MessageShape<typeof RequestSchema>` from the schema or normalize with `create(RequestSchema, request)`; if you use `@connectum/auth` and your gateway clients send `x-auth-*` headers that a handler reads, a `verifyCredentials` or `mapSession` callback can return `null` or a partial object, a verifier grants a scope that contains a space while `propagateHeaders` is on, or identities near the header limits (subject 512, type 128, name 256, roles, scopes or claims 8192 characters) are propagated, or your `trustSource` lists a CIDR block, follow [Auth identity handling](/en/migration/auth-identity): the gateway interceptor now deletes every `x-auth-*` header and refuses CIDR blocks without `allowCallerControlledCidr`, such results are `Unauthenticated`, an identity that does not fit its headers is refused instead of cut, non-Latin text is encoded, and each request gets its own copy of the cached identity |
| 1.1.x | Review the 1.2 and 1.3 release notes for each installed package and run your existing tests; the 1.3 actions for 1.2.x apply as well |
| 1.0.x | Review package release notes; 1.1 capabilities are additive; the 1.3 actions for 1.2.x apply as well |
| RC or alpha | Follow [Migrating to 1.0](/en/migration/1.0), then review the [Service Catalog migration](/en/migration/service-catalog) |

## Focused Migrations

- [Migrating to 1.0](/en/migration/1.0) — Node.js floor, explicit resilience,
  streaming transport validation, and removed EventBus `sync` option.
- [Migrating to the Service Catalog](/en/migration/service-catalog) — replace
  legacy service registration and manual client routing.
- [Custom protocols: setup/register split](/en/migration/protocol-setup) — move
  one-time work of your own `ProtocolRegistration` into `setup(context)`, and review
  `defineLazyService` factories that relied on one instance per transport (1.3;
  other applications using only built-in protocols need no changes).
- [Peer dependencies on protobuf and Connect](/en/migration/peer-dependencies) — keep
  `@bufbuild/protobuf`, `@connectrpc/connect` and `@connectrpc/connect-node` pins inside
  the peer ranges (1.3; **breaking** for out-of-range pins).
- [Erasable proto enums](/en/migration/erasable-enums) — generate proto enums as
  `as const` objects (`erasable_syntax=true`) and update code that used enum reverse
  mapping; only for projects whose protos declare enums.
- [Signed tokens must carry `exp`](/en/migration/token-expiration) — from 1.3,
  `createJwtAuthInterceptor` and `signedTokenTrust` reject a signed token that has no
  `exp` claim unless you set `requireExpiration: false` (**breaking** for issuers that
  mint tokens without `exp`).
- [RPC telemetry attribute names](/en/migration/otel-rpc-attributes) — from 1.3,
  `@connectum/otel` names span and metric attributes `rpc.system.name`, a fully
  qualified `rpc.method` and `rpc.response.status_code` instead of `rpc.system`,
  `rpc.service` and `rpc.connect_rpc.status_code` (**breaking** for dashboards, alerts
  and code that use the old names or constants). From 1.3, spans also end with an unset
  status on success instead of `OK` (**breaking** for queries that select `status = ok`);
  the guide covers both changes.
- [Kafka adapter options](/en/migration/kafka-adapter-options) — from 1.3,
  `@connectum/events-kafka` has its own option types: `kafkaConfig` is replaced by
  top-level `ssl`, `sasl`, timeouts, `retry` and `logLevel` plus `clientOptions`, and
  `compression` is a name (**breaking** for services that pass `kafkaConfig` or a
  numeric `compression`).
- [In-process calls on shutdown](/en/migration/in-process-shutdown) — from 1.3,
  `server.stop()` aborts `context.signal` of in-flight in-process calls exactly
  like HTTP calls.
- [Event bus stops receiving at the shutdown signal](/en/migration/events-reception-on-shutdown) —
  from 1.3, the bus ends its subscriptions when the shutdown signal aborts, and a
  message that arrives before the bus hook runs is redelivered instead of handled
  with a cancelled `ctx.signal`.
- [Logger bodies are opt-in](/en/migration/logger-bodies) — from 1.3,
  `createLoggerInterceptor` passes request and response bodies to the log sink only
  with `includeBodies: true` (**breaking** for anything that reads bodies from the log).
- [Error handler keeps non-Connect messages on the server](/en/migration/error-handler-messages) —
  from 1.3, `errorHandler` sends `internal error` (or an empty text for an error with a
  numeric `code`) instead of the text of an exception that is not a `ConnectError` or
  `SanitizableError`, unless `exposeErrorMessages: true` (**breaking** for clients that
  read that text).
- [Option descriptors from the packages](/en/migration/option-descriptor-imports) —
  from 1.3, generated code can import the auth and events option descriptors from
  `@connectum/auth` / `@connectum/events` instead of generating local copies;
  optional, for projects scaffolded with `--auth` or `--events` before 1.3.
- [events-amqp 1.3 behavior changes](/en/migration/events-amqp-1.3) — single
  `disconnected` per drop, re-subscribing after recovery gives up, typed initial-connect
  failure, `recovery: false` close reporting, isolated lifecycle callbacks, and the
  `amqplib` 2.2.0 minimum (1.3; for `@connectum/events-amqp` users).
- [Auth option validation](/en/migration/auth-proto-options) — from 1.3,
  `@connectum/auth` throws on a misspelled proto policy, on a method that is both
  `public` and `internal`, on `skipMethods: ['*']` and on unusable cache bounds;
  rejects an identity with NUL, CR, LF or a character above U+00FF when
  `propagateHeaders` is on; and `signedTokenTrust` identifies callers by their
  verified issuer (**breaking** for those configurations).
- [HTTP health options are validated](/en/migration/healthcheck-http-options) — from
  1.3, `Healthcheck()` throws on an empty or malformed `httpPaths` instead of serving
  nothing, and `/healthz?service=<name>` no longer depends on the `Host` header
  (**breaking** for `httpPaths: []`; use `httpEnabled: false`).
- [Interceptor option validation](/en/migration/interceptor-options) — from 1.3,
  the numeric options of the timeout, bulkhead, circuit breaker and retry interceptors
  must be integers (delays at most 2147483647 ms), `createDefaultInterceptors()`
  refuses `fallback: true`, `null` and other non-object values with a `TypeError`, and
  `connectum init --resilience` no longer offers `fallback` (**breaking** for
  configurations that passed such values).
- [Test fixture descriptors follow protobuf-es](/en/migration/test-fixtures-descriptors) —
  from 1.3, the descriptor mocks of `@connectum/test-fixtures` and `@connectum/testing`
  zero-initialise fields in `create()`, derive `localName` from the proto name, number
  fields uniquely (a repeated number throws), escape reserved names with `$`,
  link fields to their message through `parent`, report the proto3 edition and mark
  sensitive fields with a real `FieldOptions`, and `createMockNextSlow` returns
  copies (**breaking** for tests that rely on the old mock behavior).
- [Auth identity handling](/en/migration/auth-identity) — from 1.3,
  `createGatewayAuthInterceptor` deletes every standard `x-auth-*` header, a
  `verifyCredentials` or `mapSession` result that is not a complete `AuthContext` is
  `Unauthenticated`, a scope that contains a space is rejected when `propagateHeaders` is
  on, CIDR blocks in `trustSource` need `allowCallerControlledCidr`, an identity that does
  not fit its headers is refused instead of cut, non-Latin text is encoded, and each request
  gets its own copy of the cached identity (**breaking** for code that relied on any of these).

## Release History

Full release narratives, pull requests, and package-specific dependency updates
belong in [Connectum GitHub releases](https://github.com/Connectum-Framework/connectum/releases)
and package changelogs. This page keeps only information needed to decide and
complete an upgrade.

## Legacy Anchors

The following aliases preserve links published by the former combined changelog.
They now route readers to the focused migration or public release history.

<span id="v1-1-0"></span>
<span id="breaking-resilience-interceptors-are-now-opt-in-in-createdefaultinterceptors"></span>
<span id="minimum-nodejs-raised-to-22130"></span>
<span id="breaking-connectumcore-validates-streaming-transport-at-startup"></span>
<span id="breaking-publishoptionssync-removed-from-connectumevents"></span>
<span id="rc9-to-rc10"></span>
<span id="rc8-to-rc9"></span>
<span id="rc7-to-rc8"></span>
<span id="rc6-to-rc7"></span>
<span id="rc5-to-rc6"></span>
<span id="rc4-to-rc5"></span>
<span id="rc3-to-rc4"></span>
<span id="breaking-changes-from-alpha"></span>
<span id="key-resolution-priority-change-connectumauth"></span>
<span id="changelog"></span>
<span id="architecture-decision-records"></span>

Continue with [Migrating to 1.0](/en/migration/1.0) for required changes or the
[release history](https://github.com/Connectum-Framework/connectum/releases) for
non-actionable detail.

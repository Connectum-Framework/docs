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
| 1.2.x | Review the 1.3 release notes for each installed package and run your existing tests, then apply every action in [Actions for 1.2.x](#actions-for-1-2-x) that matches your code |
| 1.1.x | Review the 1.2 and 1.3 release notes for each installed package and run your existing tests; the 1.3 actions for 1.2.x apply as well |
| 1.0.x | Review package release notes; 1.1 capabilities are additive; the 1.3 actions for 1.2.x apply as well |
| RC or alpha | Follow [Migrating to 1.0](/en/migration/1.0), then review the [Service Catalog migration](/en/migration/service-catalog) |

### Actions for 1.2.x

Each item applies only if your code or configuration matches it.

- If you pin `@bufbuild/protobuf` or Connect, follow [Peer dependencies on protobuf and Connect](/en/migration/peer-dependencies).
- If you implement your own `ProtocolRegistration`, or a `defineLazyService` factory relies on separate instances per transport, follow [Custom protocols: setup/register split](/en/migration/protocol-setup).
- If in-process calls (`localClient`, `ctx.call`) watch `context.signal` and must finish during `server.stop()`, follow [In-process calls on shutdown](/en/migration/in-process-shutdown).
- If a service with an `eventBus` relied on a message that arrives after the shutdown began still being handled by the stopping instance, follow [Event bus stops receiving at the shutdown signal](/en/migration/events-reception-on-shutdown): the bus now stops receiving when the shutdown signal aborts, and such a message is redelivered.
- If you use `createLoggerInterceptor` and read request or response bodies from its output, follow [Logger bodies are opt-in](/en/migration/logger-bodies): bodies are no longer logged unless you set `includeBodies: true`.
- If you use the timeout or retry interceptors, or rely on a late successful response or on one more retry after a timeout or a cancellation, follow [Cancellation and Streaming Scope](/en/guide/interceptors/built-in#cancellation-and-streaming-scope): an expired timeout now aborts `req.signal` and `ctx.signal` with `DeadlineExceeded`, retry stops on cancellation, and such calls end with `DeadlineExceeded` or `Canceled`.
- If you set `outgoingInterceptors` and also copied the same signer, tracing or retry onto your resolver's transports, follow section 6 of [Migrating to the Service Catalog](/en/migration/service-catalog): the chain now runs on every route, so remove the copy.
- If a bearer signer sits in `outgoingInterceptors` and the resolver also reaches targets in another trust domain, the same section applies: the signer now runs on those targets too, so restrict it by `req.service.typeName`.
- If you use `@connectum/events-amqp`, follow [events-amqp 1.3 behavior changes](/en/migration/events-amqp-1.3): `onDisconnected` now fires once per drop (disconnect counters drop, roughly by half), you must subscribe again after `connect()` once recovery has given up, and a finite `maxRetries` makes the initial connect reject with `AmqpConnectionError` (original error in `cause`) instead of the raw error.
- If your issuer mints signed tokens without an `exp` claim, follow [Signed tokens must carry `exp`](/en/migration/token-expiration): `createJwtAuthInterceptor` and `signedTokenTrust` now reject them unless you set `requireExpiration: false`.
- If a dashboard, alert or code uses `rpc.system`, `rpc.service`, `rpc.connect_rpc.status_code` or their constants from `@connectum/otel`, follow [RPC telemetry attribute names](/en/migration/otel-rpc-attributes): they are now `rpc.system.name`, a fully qualified `rpc.method` and `rpc.response.status_code`, and a successful span now has an unset status instead of `OK` (queries that select `status = ok` must select "status is not error").
- If you pass `kafkaConfig` or a numeric `compression` to `KafkaAdapter()`, follow [Kafka adapter options](/en/migration/kafka-adapter-options): use the typed options and `clientOptions`.
- If a client reads the text of an error that a handler raised as a plain `Error`, a thrown string or an object with a numeric `code`, follow [Error handler keeps non-Connect messages on the server](/en/migration/error-handler-messages): the client now receives `internal error` (or an empty text when the error carries a numeric `code` from 1 to 16 other than `Internal`, or for an abort) unless you set `exposeErrorMessages: true`.
- If you use `@connectum/auth` with a misspelled proto `policy` or `default_policy`, a method that is both `public` and `internal`, `signedTokenTrust` issuers that rely on `sub` or `scope`, `skipMethods: ['*']`, `propagateHeaders` with identities that contain line breaks or characters above U+00FF, or a cache `ttl` or `maxSize` that is not finite or below 1, follow [Auth option validation](/en/migration/auth-proto-options): each of these now fails loudly.
- If you pass `httpPaths` to `Healthcheck()`, follow [HTTP health options are validated](/en/migration/healthcheck-http-options): an empty list (`[]`), a non-string entry, an entry without a leading `/`, or one containing `?` or `#` now throws at startup; to turn the HTTP endpoint off set `httpEnabled: false`.
- If you pass `watchInterval` other than an integer from 1 to 2147483647, `null` or a non-boolean option to `Healthcheck()`, register `Healthcheck()` twice in one server, or pass a status other than the four `ServingStatus` values to the health manager, follow [Healthcheck option checks](/en/migration/healthcheck-option-checks): each of these now throws, and `Health.Watch` now delivers every status change instead of the states a poll caught.
- If you pass a fractional number or a delay above 2147483647 ms to the timeout, bulkhead, circuit breaker or retry interceptors, `fallback: true` or `null` to `createDefaultInterceptors()`, or `fallback` to `connectum init --resilience`, an unknown key to `createDefaultInterceptors()`, `null` or a value of the wrong type for an option of an interceptor factory, or a method filter key that can never match (such as `/Unary` or `Svc/Un*`), follow [Interceptor option validation](/en/migration/interceptor-options): these now throw when the chain is built; the same page notes that the logger's `skipHealthCheck` now skips only the `grpc.health` package.
- If your tests use the descriptor mocks of `@connectum/test-fixtures` or `@connectum/testing` (`createMockDescMessage`, `createMockDescField`, `createMockDescMethod`, `createFakeMethod`, `createMockNextSlow`), follow [Test fixture descriptors follow protobuf-es](/en/migration/test-fixtures-descriptors): `create(mock)` now returns zeroed fields, a snake_case name gives a camelCase `localName`, and a repeated field number throws; the same page covers the helpers that now throw instead of building something else (an unknown scalar `type`, a field number outside the protobuf range, an unknown method kind, a second `register` of one name, a delay that is negative, `NaN` or above 2147483647 in `createMockNextSlow` or `createMockStream`).
- If your code reads the request type of a regenerated service catalog (`ConnectumCallMap`, `ConnectumStreamMap`) as a full message, follow section 3 of [Migrating to the Service Catalog](/en/migration/service-catalog): the request slot is now `MessageInitShape<typeof RequestSchema>`, so take `MessageShape<typeof RequestSchema>` from the schema or normalize with `create(RequestSchema, request)`.
- If you use `@connectum/events-redis` with a `brokerOptions.maxLen`, `blockMs` or `count` that is not a whole number in range (`maxLen: 0` included), or with a server that needs longer than `redisOptions.connectTimeout` to become ready, follow [Redis adapter options](/en/migration/redis-adapter-options): `RedisAdapter()` now throws for such an option and `connect()` rejects after the timeout.
- If you pass `KafkaAdapter()` an empty or non-array `brokers`, an empty `clientId`, a `sessionTimeout` of 3000 ms or less, an invalid `retry` or an unknown `sasl.mechanism`, follow [Kafka adapter validation](/en/migration/kafka-option-validation): the constructor now throws.
- If you pass a `topologyMode` other than the exact `assert`, `check` or `skip`, an `exchangeType` outside the four types, a `consumerOptions.prefetch` outside 0 to 65535, a `queueOptions.messageTtl` or `maxLength` that is negative or fractional, a `jitter` outside 0 to 1, or a `recovery` or `publishRetry` that is neither a boolean nor an object, follow [events-amqp option validation](/en/migration/events-amqp-options): each of these now throws when `AmqpAdapter()` is called, and a table header from an external publisher now arrives as JSON.
- If you use `@connectum/auth` and your gateway clients send `x-auth-*` headers that a handler reads, a `verifyCredentials` or `mapSession` callback can return `null` or a partial object, a verifier grants a scope that contains a space while `propagateHeaders` is on, or identities near the header limits (subject 512, type 128, name 256, roles, scopes or claims 8192 characters) are propagated, or your `trustSource` lists a CIDR block, follow [Auth identity handling](/en/migration/auth-identity): the gateway interceptor now deletes every `x-auth-*` header and refuses CIDR blocks without `allowCallerControlledCidr`, such results are `Unauthenticated`, an identity that does not fit its headers is refused instead of cut, non-Latin text is encoded, and each request gets its own copy of the cached identity.
- If you pass an empty `servers`, an `ackWait` of 0 or below, a `maxDeliver` of 0, below -1 or fractional, or an unknown `deliverPolicy` to `NatsAdapter()`, follow [NATS adapter options](/en/migration/events-nats-options): these now throw when the adapter is created.
- If you use `@connectum/auth` with a `defaultPolicy` or rule `effect` that is not exactly `allow` or `deny`, an `authorize` callback that returns a truthy value other than `true`, an `internal` proto method reached without `createInternalAuthInterceptor`, JWTs with an empty or non-string `sub`, an empty `issuer` or `audience` or `maxTokenAge: 0`, method patterns such as `Service/Write*`, an unset gateway secret or client token, follow [Auth authorization and JWT validation](/en/migration/auth-authorization-validation): each of these now fails loudly when the interceptor is created or denies the call.
- If a client treats the end of a server stream as complete, follow [Streams cut by stop()](/en/migration/shutdown-stream-cut): a stream cut by `stop()` now ends with `unavailable`.
- If you enable `fallback` together with `retry` or `circuitBreaker` in `createDefaultInterceptors()`, follow [Fallback stands outside retry and circuit breaker](/en/migration/fallback-order): retries now run before the fallback value is served and the breaker now opens.
- If you enable `fallback` in `createDefaultInterceptors()` or its `handler` returns a plain object or any value that is not the response message, follow [Fallback: validation order and handler result](/en/migration/interceptor-options#fallback-order-and-result): a request that fails validation is no longer answered by the fallback value, and a `handler` result that is not a response message now fails with a `TypeError`.
- If code matches `Unavailable` on a `ctx.call` to a service that is not mounted on a server without a `remoteResolver`, or your catalog configuration holds mistakes that used to be accepted (a non-positive `timeoutMs`, an invalid `propagateHeaders` name, an `enabledServices` entry with no matching service, a catalog key that differs from its `typeName`, the same service defined twice), follow [Service catalog checks](/en/migration/catalog-checks).
- If you pass `handlerTimeout` of `0` or a fraction, a `drainTimeout` that is `NaN`, negative or above 2147483647 ms, a `retry` delay or `multiplier` outside the documented range, an unknown `retry.backoff`, or a `dlq` without a non-empty `topic`, or if you count `dlq.error=AbortError` events on shutdown, follow [Event bus option checks](/en/migration/events-option-checks): these now throw when the bus or the middleware is created, a stop returns an event that waits between retries to the broker instead of dead-lettering it, and a failed dead-letter publish reaches the `observer`.
- If a script passes the `connectum` CLI a flag it does not define, runs `init --runtime bun --node-exec ...`, runs `generate service` outside a project (or `--with-events` without `@connectum/events`), or generates the service catalog without `target=ts` or with `output_file` twice, follow [CLI and catalog plugin input is checked](/en/migration/cli-input-checks): each of these now fails with a message instead of being accepted silently.
- If a test reaches a `createTestServer()` server from another container or host, passes it services, interceptors or protocols of the wrong type, or reads earlier exports from a later `InMemoryMetricCollector.flush()`, follow [Testing helper changes](/en/migration/testing-helpers): the test server listens on `127.0.0.1` (pass `host: '0.0.0.0'`), wrong types no longer compile and are rejected at runtime, and `flush()` returns only new data.

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
- [Redis adapter options](/en/migration/redis-adapter-options) — from 1.3,
  `RedisAdapter()` throws a `RangeError` for a `maxLen`, `blockMs` or `count` that is
  not a whole number in range (`maxLen: 0` used to delete every published event),
  `connect()` and `subscribe()` reject after `connectTimeout` when the server accepts
  the connection and never answers, and a consumer group lost by Redis is re-created
  (**breaking** for services that pass invalid `brokerOptions` or need longer than
  `connectTimeout` to become ready).
- [Kafka adapter options](/en/migration/kafka-adapter-options) — from 1.3,
  `@connectum/events-kafka` has its own option types: `kafkaConfig` is replaced by
  top-level `ssl`, `sasl`, timeouts, `retry` and `logLevel` plus `clientOptions`, and
  `compression` is a name (**breaking** for services that pass `kafkaConfig` or a
  numeric `compression`).
- [Kafka adapter validation](/en/migration/kafka-option-validation) — from 1.3,
  `KafkaAdapter()` throws for an empty or non-array `brokers`, an empty `clientId`, a
  `sessionTimeout` that is not above 3000 ms, an invalid `retry` and an unknown
  `sasl.mechanism` (**breaking** for services that pass such options).
- [Testing helper changes](/en/migration/testing-helpers) — from 1.3,
  `createTestServer()` listens on `127.0.0.1` (pass `host: '0.0.0.0'` to reach it from
  another container or host) and rejects services, interceptors and protocols of the
  wrong type, `InMemoryMetricCollector.flush()` returns only what was recorded since the
  previous flush, and the default parity comparison ignores protocol headers and the
  measured time of duration histograms (**breaking** for tests that rely on the old
  listening address or on a cumulative `flush()`).
- [In-process calls on shutdown](/en/migration/in-process-shutdown) — from 1.3,
  `server.stop()` aborts `context.signal` of in-flight in-process calls exactly
  like HTTP calls.
- [Streams cut by stop()](/en/migration/shutdown-stream-cut) — from 1.3, a server
  stream cut by `server.stop()` ends with `unavailable` instead of a normal end.
- [Service catalog checks](/en/migration/catalog-checks) — from 1.3, `ctx.call` to an
  unmounted service on a server with no `remoteResolver` fails with
  `FailedPrecondition` instead of `Unavailable` (**breaking** for code that matched
  `Unavailable`), and catalog calls and catalog configuration refuse mistakes that
  used to be accepted.
- [Event bus stops receiving at the shutdown signal](/en/migration/events-reception-on-shutdown) —
  from 1.3, the bus ends its subscriptions when the shutdown signal aborts, and a
  message that arrives before the bus hook runs is redelivered instead of handled
  with a cancelled `ctx.signal`.
- [Event bus option checks](/en/migration/events-option-checks) — from 1.3,
  `createEventBus`, `retryMiddleware` and `dlqMiddleware` throw for timeout, retry
  delay and dead-letter topic values that used to be accepted and break deliveries
  (**breaking** for those values only), a failed dead-letter publish reaches the
  `observer`, and a stop returns an event that waits between retries to the broker
  instead of dead-lettering it.
- [Logger bodies are opt-in](/en/migration/logger-bodies) — from 1.3,
  `createLoggerInterceptor` passes request and response bodies to the log sink only
  with `includeBodies: true` (**breaking** for anything that reads bodies from the log).
- [Error handler keeps non-Connect messages on the server](/en/migration/error-handler-messages) —
  from 1.3, `errorHandler` sends `internal error` (or an empty text for an error with a
  numeric `code` other than `Internal`, or for an abort) instead of the text of an exception that is not a `ConnectError` or
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
- [events-amqp option validation](/en/migration/events-amqp-options) — from 1.3,
  `AmqpAdapter()` rejects an unknown `topologyMode` or `exchangeType`, an out-of-range
  `prefetch`, `messageTtl`, `maxLength` or `jitter` and other unusable options at
  creation; table headers arrive as JSON; an invalid publish argument is no longer
  retried (for `@connectum/events-amqp` users).
- [CLI and catalog plugin input is checked](/en/migration/cli-input-checks) — from 1.3,
  `connectum` refuses unknown flags, `--node-exec` with Bun, and `generate service`
  outside a project; `protoc-gen-connectum-catalog` refuses any `target` but `ts` and a
  repeated `output_file` (**breaking** for scripts that relied on the old silent
  acceptance).
- [Auth option validation](/en/migration/auth-proto-options) — from 1.3,
  `@connectum/auth` throws on a misspelled proto policy, on a method that is both
  `public` and `internal`, on `skipMethods: ['*']` and on unusable cache bounds;
  rejects an identity with NUL, CR, LF or a character above U+00FF when
  `propagateHeaders` is on; and `signedTokenTrust` identifies callers by their
  verified issuer (**breaking** for those configurations).
- [Auth authorization and JWT validation](/en/migration/auth-authorization-validation) —
  from 1.3, `@connectum/auth` throws on a `defaultPolicy` or rule `effect` that is not
  `allow` or `deny`, on method patterns that cannot match, on an empty JWT `issuer` or
  `audience` and on unusable gateway, internal, generic and client options; the
  `authorize` callback allows only on exactly `true`; JWTs need a non-empty string
  subject; and an `internal` proto method is open only to an identity from
  `createInternalAuthInterceptor` (**breaking** for those configurations).
- [HTTP health options are validated](/en/migration/healthcheck-http-options) — from
  1.3, `Healthcheck()` throws on an empty or malformed `httpPaths` instead of serving
  nothing, and `/healthz?service=<name>` no longer depends on the `Host` header
  (**breaking** for `httpPaths: []`; use `httpEnabled: false`).
- [Healthcheck option checks](/en/migration/healthcheck-option-checks) — from 1.3,
  `Healthcheck()` throws on an unusable `watchInterval`, a `null` options object, a bad
  `manager` or `httpEnabled`, and on a second registration in one server; the manager
  refuses statuses other than the four `ServingStatus` values;
  `createHttpHealthHandler` validates its paths; `Health.Watch` delivers every change
  (**breaking** for configurations that relied on the old silent acceptance).
- [Interceptor option validation](/en/migration/interceptor-options) — from 1.3,
  the numeric options of the timeout, bulkhead, circuit breaker and retry interceptors
  must be integers (delays at most 2147483647 ms), `createDefaultInterceptors()`
  refuses `fallback: true`, `null` and other non-object values with a `TypeError`, and
  `connectum init --resilience` no longer offers `fallback` (**breaking** for
  configurations that passed such values).
- [Fallback stands outside retry and circuit breaker](/en/migration/fallback-order) —
  from 1.3, `createDefaultInterceptors()` places the fallback in front of retry and the
  circuit breaker: retries run, the breaker opens, and the fallback value is served
  after both (**breaking** result for chains that combined `fallback` with `retry` or
  `circuitBreaker`).
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
- [OpenTelemetry configuration](/en/migration/otel-configuration) — from 1.3,
  `@connectum/otel` ignores a wrong `OTEL_*` exporter, protocol or endpoint value with a
  `CONNECTUM_OTEL_INVALID_ENV` process warning instead of failing every RPC, decodes
  `OTEL_RESOURCE_ATTRIBUTES` as percent-encoded, rejects a misspelled `initProvider`
  `settings` value with `TypeError`, and makes a concurrent `shutdownProvider()` wait for
  the flush (behaviour change for code that relied on the exception, on a literal `%`, or
  on the second call returning at once).
- [NATS adapter options](/en/migration/events-nats-options) — from 1.3,
  `NatsAdapter()` throws at creation for an empty `servers`, `ackWait` of 0 or below,
  `maxDeliver` of 0, below -1 or fractional, and an unknown `deliverPolicy`
  (**breaking** for configurations that passed one of these), and publish metadata
  with `x-*` keys and empty values reaches the handler.
  sensitive fields with a real `FieldOptions`, and `createMockNext` and
  `createMockNextSlow` return copies at every depth. The fixtures also throw on an
  unknown scalar `type`, a field number outside the protobuf range, an unknown method
  kind, a repeated `register` and an unusable delay, and `createMockFn` records the
  `this`, result and error of each call (**breaking** for tests that rely on the old mock
  behavior).

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

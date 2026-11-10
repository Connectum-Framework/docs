---
title: Unit tests and fixtures
description: Test handler decisions and interceptors in isolation with Connectum mocks and assertions.
docType: how-to
outline: deep
---

# Unit tests and fixtures

Test business rules without constructing a server when the rule does not need
the RPC boundary. Pass explicit dependencies to the function under test and
assert both the result and the side effects it is allowed to perform.

For an interceptor, `@connectum/test-fixtures` supplies transport-free requests,
downstream functions, descriptor mocks, streams and error assertions. It is meant
for authors of interceptor and descriptor-level tests; most application tests
depend on `@connectum/testing`, which re-exports these helpers and adds a test
server. These helpers do not prove that a running service has the
right middleware or routes; cover that in
[integration tests](/en/guide/testing/integration).

## Installation {#installation}

::: pm
== npm
```bash
npm install -D @connectum/test-fixtures
```
== pnpm
```bash
pnpm add -D @connectum/test-fixtures
```
== bun
```bash
bun add -d @connectum/test-fixtures
```
:::

The package shares `@bufbuild/protobuf` and `@connectrpc/connect` with your
application; keep their versions inside the declared peer ranges. See
[peer dependency compatibility](/en/migration/peer-dependencies).

## Exercise an interceptor

This test checks that error handling preserves an intentional Connect error
and invokes the downstream function once:

```typescript
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { Code } from '@connectrpc/connect';
import { createErrorHandlerInterceptor } from '@connectum/interceptors';
import { assertConnectError, createMockNextError, createMockRequest } from '@connectum/test-fixtures';

test('preserves an intentional not-found error', async () => {
  const next = createMockNextError(Code.NotFound, 'page not found');
  const invoke = createErrorHandlerInterceptor({ logErrors: false })(next);

  await assert.rejects(() => invoke(createMockRequest()), (error) => {
    assertConnectError(error, Code.NotFound, /page not found/);
    return true;
  });
  assert.equal(next.mock.callCount(), 1);
});
```

Use `createMockNext({ message })` for a successful downstream call and
`createMockNextSlow(delay, options)` for a delayed one. The successful mocks
return a partial response with `stream` and `message`: when the interceptor
reads headers, trailers or response descriptors, supply a real response instead.
Use `createMockStream()` when the behavior under test consumes an async iterator.

## Handlers that call other services

`createMockContext`, `mockService` and `mockResolver` belong to
`@connectum/testing`. They let a handler exercise typed catalog dispatch against
explicit mock implementations rather than starting remote services. The context
needs a non-empty catalog with at least one method; missing mocks do not silently
fall through to a real network service. See the
[catalog mocking example](/en/guide/service-communication/resolver-configuration#testing-with-mocks)
and the [mock-context API](/en/api/@connectum/testing/index/functions/createMockContext).

## Descriptor mocks follow protobuf-es {#descriptor-fidelity}

`createMockDescMessage`, `createMockDescField`, `createMockDescMethod` and `createFakeMethod` follow the rules of compiled protobuf-es descriptors, so `create()` and name lookups behave as they do in production:

- `create(mock)` returns every declared field with its zero value, and each oneof group as `{ case: undefined }`. `members` lists the standalone fields in declaration order, then the oneof groups.
- A field `name` is the proto name. `localName` and `jsonName` are derived from it (`user_id` gives `userId`); a `localName` that collides with `constructor`, `toString`, `toJSON` or `valueOf` gets a `$` suffix. The same suffix applies to method `localName` (`ToString` gives `toString$`).
- Field numbers that are not set continue from the highest number used so far; repeating a number throws an `Error`.
- `createMockNext` and `createMockNextSlow` deeply copy the configured `message` on every call. Editing a nested response object changes neither the next response nor the configuration. Plain objects, arrays, `Map`, `Set`, `Date`, `RegExp`, `Buffer`, typed arrays and `ArrayBuffer` are copied; other nested objects (`Headers`, `URL`, class instances) and functions remain shared references.
- Each field of a message made by `createMockDescMessage` points back at the message through `parent`, and the file reports the proto3 edition (`file.edition` is `Edition.EDITION_PROTO3`), so `toBinary`, `isFieldSet`, `equals` and `clone` of `@bufbuild/protobuf` accept the mock. The link is circular: `JSON.stringify` of a mock message that has fields throws `TypeError`, as it does for a compiled descriptor, so serialise `typeName` and the field names instead. A field made by `createMockDescField` alone and a method made by `createMockDescMethod` have `parent` `undefined`; use `createFakeMethod(service, name)` for a method attached to a service.
- A field created with `isSensitive: true`, alone or inside the `fields` of `createMockDescMessage`, carries a real `google.protobuf.FieldOptions` message with `debugRedact: true` in `proto.options`. `useSensitiveRedaction` of `createMockDescMethod` is deprecated: `MethodOptions` has no such property, so its `{ debug_redact: true }` marker exists only in the fixture.

```typescript
import assert from 'node:assert/strict';
import { create } from '@bufbuild/protobuf';
import { createMockDescMessage } from '@connectum/test-fixtures';

const desc = createMockDescMessage('acme.v1.User', {
  fields: [{ name: 'user_id', type: 'int32' }, { name: 'email' }],
});

assert.deepEqual(create(desc), { $typeName: 'acme.v1.User', userId: 0, email: '' });
```

Limits: a mock oneof group has no fields (the declared fields are not attached to it), and a custom `json_name` option cannot be expressed. `createMockRequest` builds its `url` with the placeholder origin `http://localhost`; a request from the in-process transport carries `https://in-memory/…`, so pass `url` explicitly when the code under test depends on the origin.

Upgrading tests from earlier versions: [Test fixture descriptors follow protobuf-es](/en/migration/test-fixtures-descriptors).

Fixture factories reject unsupported input and name the argument.
`assertConnectError` also diagnoses a `ConnectError` from another installed
Connect copy. See [fixture input checks and assertion diagnostics](/en/migration/test-fixtures-descriptors#what-changed)
for accepted values and errors.

## Exact APIs

Use the [test-fixtures API](/en/api/@connectum/test-fixtures/) for factory options
and the [testing API](/en/api/@connectum/testing/) for catalog mocks. Mock factories
are also re-exported from `@connectum/testing` for compatibility; prefer their
own package when the test needs no server dependency.

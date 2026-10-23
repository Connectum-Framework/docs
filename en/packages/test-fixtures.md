---
title: '@connectum/test-fixtures'
description: Low-level mock requests, descriptors, streams, next functions, and assertions for framework and tooling tests.
docType: package-hub
---

# @connectum/test-fixtures

Low-level mock requests, descriptors, streams, next functions, and assertions for framework and tooling tests.

## Install {#installation}

::: pm
== npm
~~~bash
npm install -D @connectum/test-fixtures
~~~
== pnpm
~~~bash
pnpm add -D @connectum/test-fixtures
~~~
== bun
~~~bash
bun add -d @connectum/test-fixtures
~~~
:::

**Peer dependencies:** `@bufbuild/protobuf` `^2.16.0` and `@connectrpc/connect` `^2.2.0`,
shared with your application. npm 7+, pnpm and Bun install missing peers automatically — see
[Peer dependencies on protobuf and Connect](/en/migration/peer-dependencies).

## Start Here {#quick-start}

~~~typescript
import { createMockNext, createMockRequest } from '@connectum/test-fixtures';

const request = createMockRequest();
const next = createMockNext({ message: { ok: true } });
~~~

## Key Entry Points

| Entry point | Use it to |
|---|---|
| `createMockRequest` | Build a ConnectRPC request fixture. |
| `createFakeService` | Build descriptor-compatible fake services. |
| `createMockStream` | Create deterministic streaming inputs. |

## Descriptor Mocks Follow protobuf-es {#descriptor-fidelity}

`createMockDescMessage`, `createMockDescField`, `createMockDescMethod` and `createFakeMethod` follow the rules of compiled protobuf-es descriptors, so `create()` and name lookups behave as they do in production:

- `create(mock)` returns every declared field with its zero value, and each oneof group as `{ case: undefined }`. `members` lists the standalone fields in declaration order, then the oneof groups.
- A field `name` is the proto name. `localName` and `jsonName` are derived from it (`user_id` gives `userId`); a `localName` that collides with `constructor`, `toString`, `toJSON` or `valueOf` gets a `$` suffix. The same suffix applies to method `localName` (`ToString` gives `toString$`).
- Field numbers that are not set continue from the highest number used so far; repeating a number throws an `Error`.
- `createMockNextSlow` returns a copy of the configured `message` on every call, like `createMockNext`.
- Each field of a message made by `createMockDescMessage` points back at the message through `parent`, and the file reports the proto3 edition (`file.edition` is `Edition.EDITION_PROTO3`), so `toBinary`, `isFieldSet`, `equals` and `clone` of `@bufbuild/protobuf` accept the mock. The link is circular: `JSON.stringify` of a mock message that has fields throws `TypeError`, as it does for a compiled descriptor, so serialise `typeName` and the field names instead. A field made by `createMockDescField` alone and a method made by `createMockDescMethod` have `parent` `undefined`; use `createFakeMethod(service, name)` for a method attached to a service.
- A field created with `isSensitive: true`, alone or inside the `fields` of `createMockDescMessage`, carries a real `google.protobuf.FieldOptions` message with `debugRedact: true` in `proto.options`. `useSensitiveRedaction` of `createMockDescMethod` is deprecated: `MethodOptions` has no such property, so its `{ debug_redact: true }` marker exists only in the fixture.

~~~typescript
import { create } from '@bufbuild/protobuf';
import { createMockDescMessage } from '@connectum/test-fixtures';

const desc = createMockDescMessage('acme.v1.User', {
  fields: [{ name: 'user_id', type: 'int32' }, { name: 'email' }],
});

create(desc); // { $typeName: 'acme.v1.User', userId: 0, email: '' }
~~~

Limits: a mock oneof group has no fields (the declared fields are not attached to it), and a custom `json_name` option cannot be expressed. `createMockRequest` builds its `url` with the placeholder origin `http://localhost`; a request from the in-process transport carries `https://in-memory/…`, so pass `url` explicitly when the code under test depends on the origin.

Upgrading tests from earlier versions: [Test fixture descriptors follow protobuf-es](/en/migration/test-fixtures-descriptors).

## Learn / Configure / API Reference {#api-reference}

- **Learn:** [Focused guide](/en/guide/testing)
- **Configure:** [Task and configuration guidance](/en/guide/interceptors/custom)
- **API reference:** [Exact options and symbols](/en/api/@connectum/test-fixtures/types/interfaces/MockRequestOptions)
- **Package API index:** [Generated TypeDoc](/en/api/@connectum/test-fixtures/)
- **Source:** [@connectum/test-fixtures on GitHub](https://github.com/Connectum-Framework/connectum/tree/main/packages/test-fixtures)

## Related Modules {#related-packages}

[Compare all Connectum packages](/en/packages/) by capability.

<!-- Compatibility anchors retained from the former exhaustive package page. -->
<div class="legacy-anchors" aria-hidden="true">
<span id="what-lives-here"></span>
<span id="example"></span>
</div>

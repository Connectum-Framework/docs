---
title: Test Fixture Descriptors Follow protobuf-es
description: From 1.3.0, the descriptor mocks of @connectum/test-fixtures and @connectum/testing zero-initialise fields, derive localName from the proto name, number fields uniquely, and escape reserved names.
docType: migration
---

# Test Fixture Descriptors Follow protobuf-es

> Applies to `@connectum/test-fixtures` and `@connectum/testing` 1.3.0.

## Does this apply to you?

You need to act only if **both** are true:

- your tests build descriptors with `createMockDescMessage`, `createMockDescField`, `createMockDescMethod` or `createFakeMethod`, or use `createMockNextSlow`;
- a test depends on the old behavior listed below.

Application code and tests that use only `createMockRequest`, `createMockNext`, `createMockStream` or the assertion helpers are not affected.

## What changed

| Before 1.3.0 | From 1.3.0 |
|---|---|
| `create(mock)` returned only `{ $typeName }` | `create(mock)` returns every declared field with its zero value, and each oneof group as `{ case: undefined }` |
| The field `name` was used verbatim as `localName` and `jsonName` | `name` is the proto name: `user_id` gives `localName` and `jsonName` `userId`; a `localName` such as `toString` becomes `toString$` |
| Automatic field numbers were the 1-based position; a repeated number was accepted | Automatic numbers continue from the highest number so far (`[{ name: "a", fieldNumber: 5 }, { name: "b" }]` numbers `b` as 6); a repeated number throws `Error` |
| `createMockDescMethod("ToString").localName` was `toString` | It is `toString$`, as for a compiled descriptor; `createFakeMethod` does the same |
| `createMockNextSlow` returned the configured `message` object itself | It returns a shallow copy on every call, like `createMockNext` |

Names that are already camelCase (`userId`, `email`) are unchanged.

## Required changes

1. A strict comparison of `create(mock)` with a bare `{ $typeName }` now fails. List the zero values, or compare the fields you set:

   ~~~typescript
   const mock = createMockDescMessage('acme.v1.User', {
     fields: [{ name: 'id', type: 'int32' }, { name: 'email' }],
   });

   // Before: assert.deepStrictEqual(create(mock), { $typeName: 'acme.v1.User' })
   assert.deepStrictEqual(create(mock), { $typeName: 'acme.v1.User', id: 0, email: '' });
   ~~~

2. Look up a snake_case field by its camelCase name: `desc.field.userId`, not `desc.field.user_id`. The proto name stays available as `field.name`.
3. Give every field a distinct `fieldNumber`, or leave the numbers out. Two fields with one number throw when the message is created.
4. Look up a method with a reserved name under its escaped `localName` (`toString$`).
5. If a test mutated a `message` returned by `createMockNextSlow` and expected the configured object, or the next response, to change, change the configured object (or pass a new `message`) instead; every response is now a shallow copy.

## Limits that remain

- A mock oneof group has no fields (`fields: []`), and the declared fields are not attached to it.
- A custom `json_name` option cannot be expressed; `jsonName` is always derived from the name.
- `createMockRequest` still builds `http://localhost/<service>/<method>`; a request from the in-process transport carries an `https://in-memory/…` origin. Pass `url` explicitly if the code under test depends on the origin.

## Verify

Run your test suite against `@connectum/test-fixtures` 1.3.0. For a stronger check, compile the same message with a real `.proto` and compare `create(realDescriptor)` with `create(mock)`.

See also [`@connectum/test-fixtures`](/en/packages/test-fixtures).

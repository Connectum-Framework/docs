---
title: Test Fixture Descriptors Follow protobuf-es
description: From 1.3.0, the descriptor mocks of @connectum/test-fixtures and @connectum/testing zero-initialise fields, derive localName from the proto name, number fields uniquely, and escape reserved names; the fixture helpers throw on input they cannot honour, and createMockFn records this, result and error.
docType: migration
---

# Test Fixture Descriptors Follow protobuf-es

> Applies to `@connectum/test-fixtures` and `@connectum/testing` 1.3.0.

## Does this apply to you?

You need to act only if **both** are true:

- your tests build descriptors with `createMockDescMessage`, `createMockDescField`, `createMockDescMethod` or `createFakeMethod`, or use `createMockNext`, `createMockNextSlow`, `createMockStream` or `createMockFn`;
- a test depends on the old behavior listed below, or passes a value that the helpers now refuse.

Tests that use only `createMockRequest`, `createFakeService` or `assertConnectError` with valid input are not affected.

## What changed

| Before 1.3.0 | From 1.3.0 |
|---|---|
| `create(mock)` returned only `{ $typeName }` | `create(mock)` returns every declared field with its zero value, and each oneof group as `{ case: undefined }` |
| The field `name` was used verbatim as `localName` and `jsonName` | `name` is the proto name: `user_id` gives `localName` and `jsonName` `userId`; a `localName` such as `toString` becomes `toString$` |
| Automatic field numbers were the 1-based position; a repeated number was accepted | Automatic numbers continue from the highest number so far (`[{ name: "a", fieldNumber: 5 }, { name: "b" }]` numbers `b` as 6); a repeated number throws `Error` |
| `createMockDescMethod("ToString").localName` was `toString` | It is `toString$`, as for a compiled descriptor; `createFakeMethod` does the same |
| `createMockNextSlow` returned the configured `message` object itself | It returns a copy on every call, like `createMockNext` |
| `createMockNext` and `createMockNextSlow` copied `message` one level deep: nested objects were shared between responses | Each response gets a copy at every depth (plain objects, arrays, `Map`, `Set`, `Date`, `RegExp`, `Buffer`, typed arrays; any other nested object is still handed out as it is), so editing a nested object of one response no longer changes the next |
| `createMockNextError(undefined)` produced an `Unknown` error and a number that is no `Code` was kept; `assertConnectError` skipped the message check for a `messagePattern` that was neither a string nor a RegExp | Both throw a `TypeError` naming the argument |
| A `type` that is not a scalar name (`"strng"`, `"message"`, `"enum"`) became a `string` field | `createMockDescField` and `createMockDescMessage` throw a `TypeError` that names the field, the value and the valid names |
| A `fieldNumber` of `0`, a negative number, `NaN`, a fraction, 19000 to 19999 or above 536870911 was accepted | It throws a `RangeError` that names the field and the number |
| An unknown method kind (`createMockDescMethod` `kind`, `createFakeMethod` `methodKind`) was accepted | It throws a `TypeError` that names the method, the value and the four valid kinds |
| `createFakeMethod(service, "A", { register: true })` twice left two entries in `service.methods` | The second call throws and leaves the service unchanged |
| A negative, `NaN`, infinite or too large delay (`createMockNextSlow(delay)`, `createMockStream` `delayMs`) was turned into 1 ms by the timer; `delayMs: -5` meant no delay | It throws (`TypeError` for a non-number, `RangeError` otherwise); `0` and an omitted `delayMs` still mean no delay |
| The spy `createMockFn` called the implementation without `this`, recorded only `arguments`, and `mock.calls` was the internal list | It forwards `this`, records `result`, `error` and `this` of each call, and `mock.calls` is a fresh copy, like `node:test` `mock.fn()` |
| `assertConnectError` reported `Expected ConnectError but got ConnectError` for an error of another installed copy of `@connectrpc/connect` | The message says that two copies of the package are probably installed |
| The `parent` of a field built by `createMockDescMessage` was `undefined`, so `toBinary`, `isFieldSet`, `equals` and `clone` threw `TypeError` | Each field points back at its message through `parent`; those four functions accept the mock |
| `JSON.stringify` of a mock message worked | It throws `TypeError` when the message has fields: the `parent` link is circular, as in a compiled descriptor |
| `proto.options` of a field with `isSensitive: true` was `{ debug_redact: true }` | It is a `google.protobuf.FieldOptions` message with `debugRedact: true` |
| `file.proto.edition` was the string `"EDITION_PROTO3"` | `file.edition` is `Edition.EDITION_PROTO3` (999); `file.proto.syntax` is `"proto3"` and `file.proto.edition` is `Edition.EDITION_UNKNOWN` (0) |

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
5. Serialise `typeName` and the field names instead of the descriptor object when a test passes a mock message to `JSON.stringify`. Read `proto.options.debugRedact` (not `debug_redact`) of a sensitive field, and the edition from `file.edition`. `useSensitiveRedaction` of `createMockDescMethod` is deprecated and keeps its behaviour; mark a field with `isSensitive` instead.
6. If a test mutated a `message` returned by `createMockNext` or `createMockNextSlow`, at any depth, and expected the configured object, or the next response, to change, change the configured object (or pass a new `message`) instead; every response is now a copy at every depth.
7. Fix the value a refused call names. The factories now throw where they used to build something else:

   ~~~typescript
   createMockDescField('f', { type: 'strng' });        // TypeError: unknown scalar type "strng"; expected one of: double, float, ...
   createMockDescMessage('acme.v1.M', { fields: [{ name: 'a', fieldNumber: 19000 }] }); // RangeError: field number 19000 is not allowed
   createFakeMethod(service, 'X', { methodKind: 'bogus' }); // TypeError: unknown method kind "bogus"
   createMockNextSlow(-5);                              // RangeError: delay must be a finite number of milliseconds between 0 and 2147483647
   ~~~

   In TypeScript, `type` is now the `MockScalarType` union of the fifteen scalar names; a `string` variable needs a narrowing or a cast. For a field of a message type or an enum there is no mock: a scalar stands in for it.
8. Use `0` (or leave `delayMs` out) where a test passed a negative `delayMs` to mean no delay.
9. A call record of `createMockFn` now has four keys (`arguments`, `result`, `error`, `this`), as in `node:test`. Replace `assert.deepStrictEqual(fn.mock.calls, [{ arguments: [1] }])` with `assert.deepStrictEqual(fn.mock.calls.map((call) => call.arguments), [[1]])`, and read `fn.mock.calls` again after each call: it is a copy, so a list read earlier does not grow. A hand-written `MockCall` literal needs the new fields.

## Limits that remain

- A mock oneof group has no fields (`fields: []`), and the declared fields are not attached to it.
- A custom `json_name` option cannot be expressed; `jsonName` is always derived from the name.
- `createMockRequest` still builds `http://localhost/<service>/<method>`; a request from the in-process transport carries an `https://in-memory/…` origin. Pass `url` explicitly if the code under test depends on the origin.

## Verify

Run your test suite against `@connectum/test-fixtures` 1.3.0. For a stronger check, compile the same message with a real `.proto` and compare `create(realDescriptor)` with `create(mock)`.

See also [`@connectum/test-fixtures`](/en/packages/test-fixtures).

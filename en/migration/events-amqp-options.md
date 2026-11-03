---
title: events-amqp Option Validation
description: AmqpAdapter() now rejects options that cannot work, with an error that names the option; table headers reach handlers as JSON; invalid publish arguments are no longer retried.
docType: migration
---

# events-amqp Option Validation

> Applies to `@connectum/events-amqp` 1.3.0.

## Does this apply to you?

You need to act if your service passes any of the following to `AmqpAdapter()` or relies on the behavior below:

- a `topologyMode` that is not exactly `"assert"`, `"check"` or `"skip"` (`"CHECK"`, `"Skip"`, a typo, `null`, `""`);
- an `exchangeType` that is not `"topic"`, `"direct"`, `"fanout"` or `"headers"`;
- `consumerOptions.prefetch` that is not an integer from 0 to 65535;
- `queueOptions.messageTtl` or `queueOptions.maxLength` that is negative, fractional or not a number;
- a finite `recovery.jitter` or `publishRetry.jitter` outside 0 to 1 (`NaN` and the infinities keep using the default);
- the same `exchangeType` or `topologyMode` values passed to `FakeAmqpAdapter` in tests, which now throws as well;
- `recovery` or `publishRetry` that is neither a boolean nor an object, or a non-numeric `publishRetry.maxRetries`;
- a `serialization.encode` or `serialization.decode` that is not a function, or a `contentType` that is not a string;
- a handler that reads `event.metadata` values that came from an AMQP table or array;
- code that expects `publish()` to reject an unencodable routing key, `messageId` or `timestamp` with `AmqpConnectionError`.

If none of these applies, nothing changes.

## Required changes

`AmqpAdapter()` now throws a `TypeError` (wrong type or an unsupported value) or a `RangeError` (a number out of range) at the call, and the message names the option and the accepted values. Before, each of these was accepted:

- **An unknown `topologyMode` acted as `"assert"`**, so a service meant to leave the topology to the operator (`"check"`, `"skip"`) declared the exchange and queues itself. Spell the mode exactly.
- **An unknown `exchangeType`** made `connect()` wait in the retry loop for the broker to accept it. Use one of the four types.
- **An out-of-range `prefetch`, `messageTtl` or `maxLength`** failed at `subscribe()` with a raw error from amqplib or the broker. A finite `jitter` above 1 was clamped to 1 without a word. Pass a value inside the documented range.
- **A missing `options` argument** failed with `Cannot read properties of undefined`. Pass an object.

```typescript
// Before: accepted, and acted as "assert"
AmqpAdapter({ url, topologyMode: 'CHECK' });

// After
AmqpAdapter({ url, topologyMode: 'check' });
```

Values with a documented fallback are unchanged: `publishTimeoutMs`, `recovery.initialConnectMaxRetries`, and fractional or negative retry counts.

## Behavior that changed without an option

- **Table and array headers.** For a message from an external publisher, a header that is an AMQP table reaches `ctx.metadata` as JSON text (`{"a":1}`), not `"[object Object]"`, and an array as `[1,"a"]`, not `1,a`. Scalars are unchanged. If you parsed the old array form, parse JSON instead.
- **Invalid publish arguments.** A routing key or `messageId` over 255 bytes, or a `timestamp` that is NaN, negative, fractional or infinite, rejects `publish()` with amqplib's `TypeError` or `RangeError` instead of `AmqpConnectionError`, and `publishRetry` no longer repeats it. If you branch on `AmqpConnectionError` to decide on a republish, such a call is now outside that branch: it can never succeed.

## Verify the upgrade

Create the adapter in a startup test: an invalid option throws at that call.

## Related

- [Run the AMQP adapter reliably](/en/guide/events/amqp-reliability)
- [events-amqp 1.3 behavior changes](/en/migration/events-amqp-1.3)

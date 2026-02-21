[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / wrapAsyncIterable

# Function: wrapAsyncIterable()

> **wrapAsyncIterable**\<`T`\>(`iterable`, `span`, `direction`, `recordMessages`, `endSpanOnComplete?`): `AsyncGenerator`\<`T`\>

Defined in: [packages/otel/src/shared.ts:81](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/otel/src/shared.ts#L81)

Wraps an AsyncIterable to track streaming messages with OTel span events.

Captures the span via closure (not AsyncLocalStorage) to avoid
the Node.js ALS context loss in async generators (nodejs/node#42237).

When `endSpanOnComplete` is true, the span lifecycle is managed by the
generator itself: the span is ended in the `finally` block, which runs
on normal completion, error, or early break (generator.return()).

## Type Parameters

### T

`T`

## Parameters

### iterable

`AsyncIterable`\<`T`\>

The source async iterable (streaming messages)

### span

[`Span`](https://open-telemetry.github.io/opentelemetry-js/interfaces/_opentelemetry_api.Span.html)

The OTel span to record events on

### direction

'SENT' for outgoing, 'RECEIVED' for incoming messages

`"SENT"` | `"RECEIVED"`

### recordMessages

`boolean`

Whether to record individual message events

### endSpanOnComplete?

`boolean` = `false`

Whether to end the span when the stream completes

## Returns

`AsyncGenerator`\<`T`\>

A new AsyncGenerator that yields the same messages with span events

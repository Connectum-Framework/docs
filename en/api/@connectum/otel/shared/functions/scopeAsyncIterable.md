[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [shared](../index.md) / scopeAsyncIterable

# Function: scopeAsyncIterable()

> **scopeAsyncIterable**\<`T`\>(`iterable`, `scope`): [`AsyncIterable`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols)\<`T`\>

Defined in: [shared.ts:146](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/shared.ts#L146)

Runs every step of an async iterable inside a fixed OpenTelemetry context.

A streaming handler is an async generator whose body does not run when the
interceptor returns the response: it runs later, step by step, each time the
transport pulls the next message. By then `startActiveSpan` has already
returned, so without this scope the handler runs with whatever context the
puller happens to have and `trace.getActiveSpan()` is empty. Creating the
iterator and calling `next()`, `return()` and `throw()` under `scope` makes
the span in `scope` the active span for the handler's code, including its
`finally` block, and parents any span the handler starts to it.

The scope covers only the synchronous start of each step and the
continuations that start from it. It is never entered permanently: the code
that called `next()` keeps its own context once the call returns. The
returned iterator holds `scope` for as long as the iterator itself is
reachable. Only the steps taken through the returned iterator are scoped:
code that finishes the underlying generator directly (calling `return()` on
it, not on the returned iterator) bypasses the scope.

## Type Parameters

### T

`T`

## Parameters

### iterable

[`AsyncIterable`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols)\<`T`\>

The iterable whose steps must run inside `scope`

### scope

`Context`

The context to run each step in (carrying the active span)

## Returns

[`AsyncIterable`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols#the_async_iterator_and_async_iterable_protocols)\<`T`\>

An iterable producing the same values, with every step run in `scope`

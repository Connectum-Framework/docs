[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [traced](../index.md) / traced

# Function: traced()

> **traced**\<`T`\>(`fn`, `options?`): `T`

Defined in: [traced.ts:62](https://github.com/Connectum-Framework/connectum/blob/main/packages/otel/src/traced.ts#L62)

Wraps a function in an OpenTelemetry span.

The wrapper preserves the original function's type signature.
Supports sync and async functions and sync and async generator functions.
The span ends when a returned promise settles (a native promise of another realm
counts as a promise; the caller receives a new promise in both cases), when a
returned generator is exhausted, throws or is closed, or when a returned thenable
that is not a native promise (a query builder such as Knex or a Mongoose `Query`)
settles. For a generator and a thenable the caller receives the same object: `then`
(or `next`, `return`, `throw`) is replaced on it until it is done, then `then` is put
back, so a builder keeps its chain methods and stays lazy. The span of a thenable also
covers the time between the call and the first read; the event
`connectum.result.read` marks where that idle time ends. Traced functions that return
the same thenable one from another (up to eight layers) all end with it.

Limits of following a thenable:
- It is followed through `then`. A builder consumed some other way (Mongoose
  `exec()`, `cursor()`, `clone()`; Knex `stream()`, `toSQL()`, `clone()`; superagent
  `end(callback)`) or an immutable builder whose
  chain methods return new objects never calls the `then` that was replaced. Such a
  span ends when the garbage collector collects the thenable, at the moment
  the function returned (as the span ended before thenables were followed) and the event `connectum.result.unread`. The moment is up to the
  collector, and a process that exits first exports nothing. To get a span that covers
  the work, `await` the builder inside the traced function (`traced(async () => await
  query.exec())`).
- A success or failure handler that the caller leaves out (`then(f)`, `catch(f)`
  through `then(undefined, f)`) is passed to the thenable as missing, as without
  tracing. The outcome is then read from the promise that `then` returns, which every
  real library returns. A callback-style thenable that returns no native promise tells
  the span nothing about the outcome the caller did not ask for; `await` gives both
  handlers.
- A frozen or sealed thenable, one whose `then` is a getter (it is read again on every
  use, which a fixed function would change), and one already followed by eight layers
  end their span at once. A generator that is never iterated never ends its span.

## Type Parameters

### T

`T` *extends* (...`args`) => `any`

## Parameters

### fn

`T`

The function to wrap

### options?

[`TracedOptions`](../../interfaces/TracedOptions.md)

Tracing options

## Returns

`T`

Wrapped function with the same type signature

## Example

```typescript
const findUser = traced(async (id: string) => {
    return await db.users.findById(id);
}, { name: "UserService.findUser" });
```

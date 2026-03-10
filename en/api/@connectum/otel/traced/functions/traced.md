[Connectum API Reference](../../../../index.md) / [@connectum/otel](../../index.md) / [traced](../index.md) / traced

# Function: traced()

> **traced**\<`T`\>(`fn`, `options?`): `T`

Defined in: [packages/otel/src/traced.ts:31](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/otel/src/traced.ts#L31)

Wraps a function in an OpenTelemetry span.

The wrapper preserves the original function's type signature.
Supports both sync and async functions.

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

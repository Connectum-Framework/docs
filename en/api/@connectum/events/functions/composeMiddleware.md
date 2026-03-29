[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / composeMiddleware

# Function: composeMiddleware()

> **composeMiddleware**(`middlewares`, `handler`): (`event`, `ctx`) => `Promise`\<`void`\>

Defined in: [packages/events/src/middleware.ts:24](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/middleware.ts#L24)

Compose an array of middleware into a single handler.

Middleware is applied from left to right (outer to inner).
The innermost function is the actual event handler.

Uses a dispatch pattern that guards against double next() invocation.

## Parameters

### middlewares

[`EventMiddleware`](../types/type-aliases/EventMiddleware.md)[]

Middleware functions to compose

### handler

(`event`, `ctx`) => `Promise`\<`void`\>

The final handler (innermost)

## Returns

Composed handler function

> (`event`, `ctx`): `Promise`\<`void`\>

### Parameters

#### event

[`RawEvent`](../types/interfaces/RawEvent.md)

#### ctx

[`EventContext`](../types/interfaces/EventContext.md)

### Returns

`Promise`\<`void`\>

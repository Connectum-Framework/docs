[Connectum API Reference](../../../index.md) / [@connectum/events](../index.md) / composeMiddleware

# Function: composeMiddleware()

> **composeMiddleware**(`middlewares`, `handler`): (`event`, `ctx`) => `Promise`\<`void`\>

Defined in: [middleware.ts:22](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/middleware.ts#L22)

Compose an array of middleware into a single handler.

Middleware is applied from left to right (outer to inner).
The innermost function is the actual event handler.

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

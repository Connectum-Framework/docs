[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / MiddlewareConfig

# Interface: MiddlewareConfig

Defined in: [types.ts:228](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L228)

Built-in middleware configuration

## Properties

### custom?

> `optional` **custom**: [`EventMiddleware`](../type-aliases/EventMiddleware.md)[]

Defined in: [types.ts:234](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L234)

Custom user middleware (executed outermost)

***

### dlq?

> `optional` **dlq**: [`DlqOptions`](DlqOptions.md)

Defined in: [types.ts:232](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L232)

Dead letter queue configuration

***

### retry?

> `optional` **retry**: [`RetryOptions`](RetryOptions.md)

Defined in: [types.ts:230](https://github.com/Connectum-Framework/connectum/blob/25992b4d8beaf6921b9497536cc758b5144d1a7c/packages/events/src/types.ts#L230)

Retry configuration

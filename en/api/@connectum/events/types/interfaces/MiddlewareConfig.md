[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / MiddlewareConfig

# Interface: MiddlewareConfig

Defined in: [packages/events/src/types.ts:324](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L324)

Built-in middleware configuration

## Properties

### custom?

> `optional` **custom?**: [`EventMiddleware`](../type-aliases/EventMiddleware.md)[]

Defined in: [packages/events/src/types.ts:330](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L330)

Custom user middleware (executed outermost)

***

### dlq?

> `optional` **dlq?**: [`DlqOptions`](DlqOptions.md)

Defined in: [packages/events/src/types.ts:328](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L328)

Dead letter queue configuration

***

### retry?

> `optional` **retry?**: [`RetryOptions`](RetryOptions.md)

Defined in: [packages/events/src/types.ts:326](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L326)

Retry configuration

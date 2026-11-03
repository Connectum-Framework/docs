[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / MiddlewareConfig

# Interface: MiddlewareConfig

Defined in: [packages/events/src/types.ts:364](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L364)

Built-in middleware configuration

## Properties

### custom?

> `optional` **custom?**: [`EventMiddleware`](../type-aliases/EventMiddleware.md)[]

Defined in: [packages/events/src/types.ts:370](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L370)

Custom user middleware (executed outermost)

***

### dlq?

> `optional` **dlq?**: [`DlqOptions`](DlqOptions.md)

Defined in: [packages/events/src/types.ts:368](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L368)

Dead letter queue configuration

***

### retry?

> `optional` **retry?**: [`RetryOptions`](RetryOptions.md)

Defined in: [packages/events/src/types.ts:366](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L366)

Retry configuration

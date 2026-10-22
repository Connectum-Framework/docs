[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / MiddlewareConfig

# Interface: MiddlewareConfig

Defined in: [packages/events/src/types.ts:341](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L341)

Built-in middleware configuration

## Properties

### custom?

> `optional` **custom?**: [`EventMiddleware`](../type-aliases/EventMiddleware.md)[]

Defined in: [packages/events/src/types.ts:347](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L347)

Custom user middleware (executed outermost)

***

### dlq?

> `optional` **dlq?**: [`DlqOptions`](DlqOptions.md)

Defined in: [packages/events/src/types.ts:345](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L345)

Dead letter queue configuration

***

### retry?

> `optional` **retry?**: [`RetryOptions`](RetryOptions.md)

Defined in: [packages/events/src/types.ts:343](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L343)

Retry configuration

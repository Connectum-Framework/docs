[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / MiddlewareConfig

# Interface: MiddlewareConfig

Defined in: [packages/events/src/types.ts:297](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L297)

Built-in middleware configuration

## Properties

### custom?

> `optional` **custom?**: [`EventMiddleware`](../type-aliases/EventMiddleware.md)[]

Defined in: [packages/events/src/types.ts:303](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L303)

Custom user middleware (executed outermost)

***

### dlq?

> `optional` **dlq?**: [`DlqOptions`](DlqOptions.md)

Defined in: [packages/events/src/types.ts:301](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L301)

Dead letter queue configuration

***

### retry?

> `optional` **retry?**: [`RetryOptions`](RetryOptions.md)

Defined in: [packages/events/src/types.ts:299](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L299)

Retry configuration

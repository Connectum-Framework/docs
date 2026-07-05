[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / MiddlewareConfig

# Interface: MiddlewareConfig

Defined in: [packages/events/src/types.ts:312](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L312)

Built-in middleware configuration

## Properties

### custom?

> `optional` **custom?**: [`EventMiddleware`](../type-aliases/EventMiddleware.md)[]

Defined in: [packages/events/src/types.ts:318](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L318)

Custom user middleware (executed outermost)

***

### dlq?

> `optional` **dlq?**: [`DlqOptions`](DlqOptions.md)

Defined in: [packages/events/src/types.ts:316](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L316)

Dead letter queue configuration

***

### retry?

> `optional` **retry?**: [`RetryOptions`](RetryOptions.md)

Defined in: [packages/events/src/types.ts:314](https://github.com/Connectum-Framework/connectum/blob/main/packages/events/src/types.ts#L314)

Retry configuration

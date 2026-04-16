[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / MiddlewareConfig

# Interface: MiddlewareConfig

Defined in: [packages/events/src/types.ts:284](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L284)

Built-in middleware configuration

## Properties

### custom?

> `optional` **custom?**: [`EventMiddleware`](../type-aliases/EventMiddleware.md)[]

Defined in: [packages/events/src/types.ts:290](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L290)

Custom user middleware (executed outermost)

***

### dlq?

> `optional` **dlq?**: [`DlqOptions`](DlqOptions.md)

Defined in: [packages/events/src/types.ts:288](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L288)

Dead letter queue configuration

***

### retry?

> `optional` **retry?**: [`RetryOptions`](RetryOptions.md)

Defined in: [packages/events/src/types.ts:286](https://github.com/Connectum-Framework/connectum/blob/4ec155025a73a300944905b8ca1a92464000b8d9/packages/events/src/types.ts#L286)

Retry configuration

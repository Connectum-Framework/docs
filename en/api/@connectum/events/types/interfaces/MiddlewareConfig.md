[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / MiddlewareConfig

# Interface: MiddlewareConfig

Defined in: [packages/events/src/types.ts:282](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events/src/types.ts#L282)

Built-in middleware configuration

## Properties

### custom?

> `optional` **custom?**: [`EventMiddleware`](../type-aliases/EventMiddleware.md)[]

Defined in: [packages/events/src/types.ts:288](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events/src/types.ts#L288)

Custom user middleware (executed outermost)

***

### dlq?

> `optional` **dlq?**: [`DlqOptions`](DlqOptions.md)

Defined in: [packages/events/src/types.ts:286](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events/src/types.ts#L286)

Dead letter queue configuration

***

### retry?

> `optional` **retry?**: [`RetryOptions`](RetryOptions.md)

Defined in: [packages/events/src/types.ts:284](https://github.com/Connectum-Framework/connectum/blob/a01886190a74a7110bf96486238bdcb7740ecf6e/packages/events/src/types.ts#L284)

Retry configuration

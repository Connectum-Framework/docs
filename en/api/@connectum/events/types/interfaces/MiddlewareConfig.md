[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / MiddlewareConfig

# Interface: MiddlewareConfig

Defined in: [packages/events/src/types.ts:267](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L267)

Built-in middleware configuration

## Properties

### custom?

> `optional` **custom**: [`EventMiddleware`](../type-aliases/EventMiddleware.md)[]

Defined in: [packages/events/src/types.ts:273](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L273)

Custom user middleware (executed outermost)

***

### dlq?

> `optional` **dlq**: [`DlqOptions`](DlqOptions.md)

Defined in: [packages/events/src/types.ts:271](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L271)

Dead letter queue configuration

***

### retry?

> `optional` **retry**: [`RetryOptions`](RetryOptions.md)

Defined in: [packages/events/src/types.ts:269](https://github.com/Connectum-Framework/connectum/blob/7390c3e88a8da28d01033cc698d683b872fdd1d2/packages/events/src/types.ts#L269)

Retry configuration

[Connectum API Reference](../../../../index.md) / [@connectum/events](../../index.md) / [types](../index.md) / MiddlewareConfig

# Interface: MiddlewareConfig

Defined in: [packages/events/src/types.ts:240](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L240)

Built-in middleware configuration

## Properties

### custom?

> `optional` **custom**: [`EventMiddleware`](../type-aliases/EventMiddleware.md)[]

Defined in: [packages/events/src/types.ts:246](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L246)

Custom user middleware (executed outermost)

***

### dlq?

> `optional` **dlq**: [`DlqOptions`](DlqOptions.md)

Defined in: [packages/events/src/types.ts:244](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L244)

Dead letter queue configuration

***

### retry?

> `optional` **retry**: [`RetryOptions`](RetryOptions.md)

Defined in: [packages/events/src/types.ts:242](https://github.com/Connectum-Framework/connectum/blob/31aac2b81d5ae69bfa6a1667e3a8107cdea942d5/packages/events/src/types.ts#L242)

Retry configuration

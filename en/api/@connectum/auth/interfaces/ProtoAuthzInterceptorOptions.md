[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / ProtoAuthzInterceptorOptions

# Interface: ProtoAuthzInterceptorOptions

Defined in: [packages/auth/src/types.ts:555](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L555)

Proto-based authorization interceptor options.

Uses proto custom options (connectum.auth.v1) for declarative authorization
rules defined in .proto files. Falls back to programmatic rules and callbacks.

## Properties

### authorize?

> `optional` **authorize?**: (`context`, `req`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [packages/auth/src/types.ts:574](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L574)

Programmatic authorization callback.
Called when neither proto options nor programmatic rules match.

#### Parameters

##### context

[`AuthContext`](AuthContext.md)

Authenticated user context

##### req

Request info (service and method names)

###### method

`string`

###### service

`string`

#### Returns

`boolean` \| `Promise`\<`boolean`\>

true if authorized, false otherwise

***

### defaultPolicy?

> `optional` **defaultPolicy?**: [`AuthzEffect`](../type-aliases/AuthzEffect.md)

Defined in: [packages/auth/src/types.ts:560](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L560)

Default policy when no proto option and no rule match.

#### Default

```ts
"deny"
```

***

### rules?

> `optional` **rules?**: [`AuthzRule`](AuthzRule.md)[]

Defined in: [packages/auth/src/types.ts:565](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L565)

Additional programmatic rules, evaluated after proto options.
Rules are evaluated in order; first matching rule wins.

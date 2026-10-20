[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / ProtoAuthzInterceptorOptions

# Interface: ProtoAuthzInterceptorOptions

Defined in: [packages/auth/src/types.ts:610](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L610)

Proto-based authorization interceptor options.

Uses proto custom options (connectum.auth.v1) for declarative authorization
rules defined in .proto files. Falls back to programmatic rules and callbacks.

## Properties

### authorize?

> `optional` **authorize?**: (`context`, `req`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [packages/auth/src/types.ts:629](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L629)

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

Defined in: [packages/auth/src/types.ts:615](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L615)

Default policy when no proto option and no rule match.

#### Default

```ts
"deny"
```

***

### rules?

> `optional` **rules?**: [`AuthzRule`](AuthzRule.md)[]

Defined in: [packages/auth/src/types.ts:620](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L620)

Additional programmatic rules, evaluated after proto options.
Rules are evaluated in order; first matching rule wins.

[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / ProtoAuthzInterceptorOptions

# Interface: ProtoAuthzInterceptorOptions

Defined in: [packages/auth/src/types.ts:730](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L730)

Proto-based authorization interceptor options.

Uses proto custom options (connectum.auth.v1) for declarative authorization
rules defined in .proto files. Falls back to programmatic rules and callbacks.

## Properties

### authorize?

> `optional` **authorize?**: (`context`, `req`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [packages/auth/src/types.ts:750](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L750)

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

`true` if authorized. Any other result, including a truthy non-boolean such as the string `"false"`, denies the call.

***

### defaultPolicy?

> `optional` **defaultPolicy?**: [`AuthzEffect`](../type-aliases/AuthzEffect.md)

Defined in: [packages/auth/src/types.ts:736](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L736)

Default policy when no proto option and no rule match. Exactly `"allow"` or `"deny"`;
any other value (`"Deny"`, `""`, `null`) makes the factory throw instead of being read as allow.

#### Default

```ts
"deny"
```

***

### rules?

> `optional` **rules?**: [`AuthzRule`](AuthzRule.md)[]

Defined in: [packages/auth/src/types.ts:741](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L741)

Additional programmatic rules, evaluated after proto options.
Rules are evaluated in order; first matching rule wins.

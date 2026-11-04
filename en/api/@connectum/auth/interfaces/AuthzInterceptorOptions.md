[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / AuthzInterceptorOptions

# Interface: AuthzInterceptorOptions

Defined in: [packages/auth/src/types.ts:342](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L342)

Authorization interceptor options

## Properties

### authorize?

> `optional` **authorize?**: (`context`, `req`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [packages/auth/src/types.ts:365](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L365)

Programmatic authorization callback.
Called after rule evaluation if no rule matched,
or always if no rules are defined.

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

Defined in: [packages/auth/src/types.ts:348](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L348)

Default policy when no rule matches. Exactly `"allow"` or `"deny"`; any other value
(`"Deny"`, `""`, `null`) makes the factory throw instead of being read as allow.

#### Default

```ts
"deny"
```

***

### rules?

> `optional` **rules?**: [`AuthzRule`](AuthzRule.md)[]

Defined in: [packages/auth/src/types.ts:354](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L354)

Declarative authorization rules.
Evaluated in order; first matching rule wins.

***

### skipMethods?

> `optional` **skipMethods?**: `string`[]

Defined in: [packages/auth/src/types.ts:372](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L372)

Methods to skip authorization for. The catch-all `"*"` is refused (creation throws);
`"*"` remains valid in the `methods` of a rule.

#### Default

```ts
[]
```

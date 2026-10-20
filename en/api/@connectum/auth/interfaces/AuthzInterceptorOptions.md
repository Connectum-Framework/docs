[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / AuthzInterceptorOptions

# Interface: AuthzInterceptorOptions

Defined in: [packages/auth/src/types.ts:269](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L269)

Authorization interceptor options

## Properties

### authorize?

> `optional` **authorize?**: (`context`, `req`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [packages/auth/src/types.ts:291](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L291)

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

true if authorized, false otherwise

***

### defaultPolicy?

> `optional` **defaultPolicy?**: [`AuthzEffect`](../type-aliases/AuthzEffect.md)

Defined in: [packages/auth/src/types.ts:274](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L274)

Default policy when no rule matches.

#### Default

```ts
"deny"
```

***

### rules?

> `optional` **rules?**: [`AuthzRule`](AuthzRule.md)[]

Defined in: [packages/auth/src/types.ts:280](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L280)

Declarative authorization rules.
Evaluated in order; first matching rule wins.

***

### skipMethods?

> `optional` **skipMethods?**: `string`[]

Defined in: [packages/auth/src/types.ts:298](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L298)

Methods to skip authorization for. The catch-all `"*"` is refused (creation throws);
`"*"` remains valid in the `methods` of a rule.

#### Default

```ts
[]
```

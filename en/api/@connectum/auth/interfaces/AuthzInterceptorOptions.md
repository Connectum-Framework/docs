[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / AuthzInterceptorOptions

# Interface: AuthzInterceptorOptions

Defined in: [packages/auth/src/types.ts:252](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L252)

Authorization interceptor options

## Properties

### authorize?

> `optional` **authorize?**: (`context`, `req`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [packages/auth/src/types.ts:274](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L274)

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

Defined in: [packages/auth/src/types.ts:257](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L257)

Default policy when no rule matches.

#### Default

```ts
"deny"
```

***

### rules?

> `optional` **rules?**: [`AuthzRule`](AuthzRule.md)[]

Defined in: [packages/auth/src/types.ts:263](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L263)

Declarative authorization rules.
Evaluated in order; first matching rule wins.

***

### skipMethods?

> `optional` **skipMethods?**: `string`[]

Defined in: [packages/auth/src/types.ts:280](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L280)

Methods to skip authorization for.

#### Default

```ts
[]
```

[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / AuthzInterceptorOptions

# Interface: AuthzInterceptorOptions

Defined in: [packages/auth/src/types.ts:244](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/auth/src/types.ts#L244)

Authorization interceptor options

## Properties

### authorize()?

> `optional` **authorize**: (`context`, `req`) => `boolean` \| `Promise`\<`boolean`\>

Defined in: [packages/auth/src/types.ts:266](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/auth/src/types.ts#L266)

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

> `optional` **defaultPolicy**: [`AuthzEffect`](../type-aliases/AuthzEffect.md)

Defined in: [packages/auth/src/types.ts:249](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/auth/src/types.ts#L249)

Default policy when no rule matches.

#### Default

```ts
"deny"
```

***

### rules?

> `optional` **rules**: [`AuthzRule`](AuthzRule.md)[]

Defined in: [packages/auth/src/types.ts:255](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/auth/src/types.ts#L255)

Declarative authorization rules.
Evaluated in order; first matching rule wins.

***

### skipMethods?

> `optional` **skipMethods**: `string`[]

Defined in: [packages/auth/src/types.ts:272](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/auth/src/types.ts#L272)

Methods to skip authorization for.

#### Default

```ts
[]
```

[Connectum API Reference](../../../../../index.md) / [@connectum/auth](../../../index.md) / [@connectum/auth](../index.md) / AuthzRule

# Interface: AuthzRule

Defined in: [packages/auth/src/types.ts:81](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L81)

Authorization rule definition.

When a rule has `requires`, the match semantics are:
- **roles**: "any-of" -- the user must have **at least one** of the listed roles.
- **scopes**: "all-of" -- the user must have **every** listed scope.

## Properties

### effect

> `readonly` **effect**: [`AuthzEffect`](../type-aliases/AuthzEffect.md)

Defined in: [packages/auth/src/types.ts:87](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L87)

Effect when rule matches

***

### methods

> `readonly` **methods**: readonly `string`[]

Defined in: [packages/auth/src/types.ts:85](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L85)

Method patterns to match (e.g., "admin.v1.AdminService/*", "user.v1.UserService/DeleteUser")

***

### name

> `readonly` **name**: `string`

Defined in: [packages/auth/src/types.ts:83](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L83)

Rule name for logging/debugging

***

### requires?

> `readonly` `optional` **requires**: `object`

Defined in: [packages/auth/src/types.ts:94](https://github.com/Connectum-Framework/connectum/blob/96762e118a8bb27fc102c6480cb8fed0afa3ac8a/packages/auth/src/types.ts#L94)

Required roles/scopes for this rule.

- `roles` uses "any-of" semantics: user needs at least one of the listed roles.
- `scopes` uses "all-of" semantics: user needs every listed scope.

#### roles?

> `readonly` `optional` **roles**: readonly `string`[]

#### scopes?

> `readonly` `optional` **scopes**: readonly `string`[]

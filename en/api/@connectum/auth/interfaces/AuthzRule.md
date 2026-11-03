[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / AuthzRule

# Interface: AuthzRule

Defined in: [packages/auth/src/types.ts:86](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L86)

Authorization rule definition.

When a rule has `requires`, the match semantics are:
- **roles**: "any-of" -- the user must have **at least one** of the listed roles.
- **scopes**: "all-of" -- the user must have **every** listed scope.

## Properties

### effect

> `readonly` **effect**: [`AuthzEffect`](../type-aliases/AuthzEffect.md)

Defined in: [packages/auth/src/types.ts:92](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L92)

Effect when rule matches. Exactly `"allow"` or `"deny"`; any other value makes the factory throw.

***

### methods

> `readonly` **methods**: readonly `string`[]

Defined in: [packages/auth/src/types.ts:90](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L90)

Method patterns to match (e.g., "admin.v1.AdminService/*", "user.v1.UserService/DeleteUser")

***

### name

> `readonly` **name**: `string`

Defined in: [packages/auth/src/types.ts:88](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L88)

Rule name for logging/debugging

***

### requires?

> `readonly` `optional` **requires?**: `object`

Defined in: [packages/auth/src/types.ts:101](https://github.com/Connectum-Framework/connectum/blob/main/packages/auth/src/types.ts#L101)

Required roles/scopes for this rule.

- `roles` uses "any-of" semantics: user needs at least one of the listed roles.
- `scopes` uses "all-of" semantics: user needs every listed scope.
- An empty or omitted list places no restriction on that dimension; `requires: {}`
  therefore matches any authenticated caller.

#### roles?

> `readonly` `optional` **roles?**: readonly `string`[]

#### scopes?

> `readonly` `optional` **scopes?**: readonly `string`[]

[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / AuthContext

# Interface: AuthContext

Defined in: [packages/auth/src/types.ts:22](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L22)

Authenticated user context

Represents the result of authentication. Set by auth interceptor,
accessible via getAuthContext() in handlers and downstream interceptors.

## Properties

### claims

> `readonly` **claims**: `Readonly`\<`Record`\<`string`, `unknown`\>\>

Defined in: [packages/auth/src/types.ts:32](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L32)

Raw claims from the credential (JWT claims, API key metadata, etc.)

***

### expiresAt?

> `readonly` `optional` **expiresAt**: `Date`

Defined in: [packages/auth/src/types.ts:36](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L36)

Credential expiration time

***

### name?

> `readonly` `optional` **name**: `string`

Defined in: [packages/auth/src/types.ts:26](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L26)

Human-readable display name

***

### roles

> `readonly` **roles**: readonly `string`[]

Defined in: [packages/auth/src/types.ts:28](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L28)

Assigned roles (e.g., ["admin", "user"])

***

### scopes

> `readonly` **scopes**: readonly `string`[]

Defined in: [packages/auth/src/types.ts:30](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L30)

Granted scopes (e.g., ["read", "write"])

***

### subject

> `readonly` **subject**: `string`

Defined in: [packages/auth/src/types.ts:24](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L24)

Authenticated subject identifier (user ID, service account, etc.)

***

### type

> `readonly` **type**: `string`

Defined in: [packages/auth/src/types.ts:34](https://github.com/Connectum-Framework/connectum/blob/4efc0ed8514c8d8d9e2d80b4e31b599e15d24c32/packages/auth/src/types.ts#L34)

Credential type identifier (e.g., "jwt", "api-key", "mtls")

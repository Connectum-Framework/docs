[Connectum API Reference](../../../index.md) / [@connectum/auth](../index.md) / AUTH\_HEADERS

# Variable: AUTH\_HEADERS

> `const` **AUTH\_HEADERS**: `object`

Defined in: [packages/auth/src/types.ts:49](https://github.com/Connectum-Framework/connectum/blob/47e0b0ef40389913ccd23186e0f4d580f701e822/packages/auth/src/types.ts#L49)

Standard header names for auth context propagation.

Used for cross-service context propagation (similar to Envoy credential injection).
The auth interceptor sets these headers when propagateHeaders is true.

WARNING: These headers are trusted ONLY in service-to-service communication
where transport security (mTLS) is established. Never trust these headers
from external clients without using createGatewayAuthInterceptor().

## Type Declaration

### CLAIMS

> `readonly` **CLAIMS**: `"x-auth-claims"` = `"x-auth-claims"`

JSON-encoded claims object

### NAME

> `readonly` **NAME**: `"x-auth-name"` = `"x-auth-name"`

Human-readable display name

### ROLES

> `readonly` **ROLES**: `"x-auth-roles"` = `"x-auth-roles"`

JSON-encoded roles array

### SCOPES

> `readonly` **SCOPES**: `"x-auth-scopes"` = `"x-auth-scopes"`

Space-separated scopes

### SUBJECT

> `readonly` **SUBJECT**: `"x-auth-subject"` = `"x-auth-subject"`

Authenticated subject identifier

### TYPE

> `readonly` **TYPE**: `"x-auth-type"` = `"x-auth-type"`

Credential type (jwt, api-key, mtls, etc.)

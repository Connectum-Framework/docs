[Connectum API Reference](../../../../index.md) / [@connectum/auth](../../index.md) / [proto](../index.md) / AuthRequirements

# Type Alias: AuthRequirements

> **AuthRequirements** = `Message`\<`"connectum.auth.v1.AuthRequirements"`\> & `object`

Defined in: packages/auth/gen/connectum/auth/v1/options\_pb.d.ts:13

Authorization requirements for a method or service.

## Type Declaration

### roles

> **roles**: `string`[]

Roles required to access the method (any-of semantics:
the user must have at least one of the listed roles).

#### Generated

from field: repeated string roles = 1;

### scopes

> **scopes**: `string`[]

Scopes required to access the method (all-of semantics:
the user must have every listed scope).

#### Generated

from field: repeated string scopes = 2;

## Generated

from message connectum.auth.v1.AuthRequirements

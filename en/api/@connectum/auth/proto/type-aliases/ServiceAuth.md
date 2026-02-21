[Connectum API Reference](../../../../index.md) / [@connectum/auth](../../index.md) / [proto](../index.md) / ServiceAuth

# Type Alias: ServiceAuth

> **ServiceAuth** = `Message`\<`"connectum.auth.v1.ServiceAuth"`\> & `object`

Defined in: packages/auth/gen/connectum/auth/v1/options\_pb.d.ts:70

Default authorization configuration for all methods in a service.

## Type Declaration

### defaultPolicy

> **defaultPolicy**: `string`

Default policy when no rule matches.
Valid values: "allow", "deny".

#### Generated

from field: optional string default_policy = 1;

### defaultRequires?

> `optional` **defaultRequires**: [`AuthRequirements`](AuthRequirements.md)

Default access requirements applied to all methods
unless overridden at the method level.

#### Generated

from field: optional connectum.auth.v1.AuthRequirements default_requires = 2;

### public

> **public**: `boolean`

Mark all methods in the service as public
(skip authentication and authorization).

#### Generated

from field: optional bool public = 3;

## Generated

from message connectum.auth.v1.ServiceAuth
